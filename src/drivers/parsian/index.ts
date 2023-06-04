import * as soap from 'soap';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export class Parsian extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.tConfig);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.tRequestOptions);

    const { amount, callbackUrl, description } = options;
    const { merchantId } = this.config;
    const client = await soap.createClientAsync(this.getLinks().REQUEST);

    const requestData: API.RequestPaymentReq = {
      Amount: amount,
      CallBackUrl: callbackUrl,
      AdditionalData: description || '',
      LoginAccount: merchantId,
      OrderId: this.generateId(),
    };

    const [response]: [API.RequestPaymentRes] = await client.SalePaymentRequestAsync({ requestData });

    const { Status, Token, Message } = response.SalePaymentRequestResult;
    if (Status.toString() !== '0' || typeof Token === 'undefined') {
      throw new RequestException(Message);
    }

    return this.makeRequestInfo(Token, 'GET', this.getLinks().PAYMENT, {
      Token,
    });
  };

  verifyPayment = async (_options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    const { Token, status } = params;
    const { merchantId } = this.config;

    if (status.toString() !== '0') {
      throw new PaymentException('تراکنش توسط کاربر لغو شد.');
    }

    const soapClient = await soap.createClientAsync(this.getLinks().VERIFICATION);

    const requestData: API.VerifyPaymentReq = {
      LoginAccount: merchantId,
      Token: Number(Token),
    };

    const [verifyResponse]: [API.VerifyPaymentRes] = await soapClient.ConfirmPaymentAsync({ requestData });

    const { CardNumberMasked, RRN, Status } = verifyResponse.ConfirmPaymentResult;
    if (!(Status.toString() === '0' && RRN > 0)) {
      throw new VerificationException('خطایی در تایید پرداخت به‌وجود آمد');
    }

    return {
      transactionId: RRN,
      cardPan: CardNumberMasked,
      raw: verifyResponse,
    };
  };

  /**
   * YYYYMMDD
   */
  dateFormat(date = new Date()) {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return yyyy.toString() + mm.toString() + dd.toString();
  }

  /**
   * HHMMSS
   */
  timeFormat(date = new Date()) {
    const hh = date.getHours();
    const mm = date.getMonth();
    const ss = date.getSeconds();
    return hh.toString() + mm.toString() + ss.toString();
  }
}

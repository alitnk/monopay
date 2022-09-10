import * as soap from 'soap';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export class Parsian extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.configSchema);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.requestSchema);

    const { amount, callbackUrl, description } = options;
    const { merchantId } = this.config;
    const client = await soap.createClientAsync(this.getLinks().REQUEST);

    const requestFields: API.RequestPaymentReq = {
      Amount: amount,
      CallBackUrl: callbackUrl,
      AdditionalData: description || '',
      LoginAccount: merchantId,
      OrderId: this.generateId(),
    };

    const response: API.RequestPaymentRes = client.SalePaymentRequest(requestFields);

    const { Status, Token } = response;
    if (Status.toString() !== '0' || typeof Token === 'undefined') {
      throw new RequestException('خطایی در درخواست پرداخت به‌وجود آمد');
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

    const requestFields: API.VerifyPaymentReq = {
      LoginAccount: merchantId,
      Token: +Token,
    };

    // 1. Verify
    const verifyResponse: API.VerifyPaymentRes = soapClient.ConfirmPayment(requestFields);

    const { CardNumberMasked, RRN, Status } = verifyResponse;
    if (!(Status.toString() === '0' && RRN > 0)) {
      const reversalRequestFields: API.ReversalPaymentReq = requestFields;
      const reversalResponse: API.ReversalPaymentRes = soapClient.ReversalRequest(reversalRequestFields);
      if (reversalResponse.Status !== '0') {
        throw new VerificationException('خطایی در تایید پرداخت به‌وجود آمد و مبلغ بازگشته نشد.');
      }
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

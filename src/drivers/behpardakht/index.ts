import soap from 'soap';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export class Behpardakht extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.tConfig);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.tRequestOptions);

    const { amount, callbackUrl, description, payerId } = options;
    const { terminalId, username, password } = this.config;
    const client = await soap.createClientAsync(this.getLinks().REQUEST);

    const requestFields: API.RequestPaymentReq = {
      terminalId,
      userName: username,
      userPassword: password,
      amount,
      callBackUrl: callbackUrl,
      orderId: this.generateId(),
      localDate: this.dateFormat(),
      localTime: this.timeFormat(),
      payerId: payerId || 0,
      additionalData: description || '',
    };

    const response: API.RequestPaymentRes = client.bpPayRequest(requestFields);
    const splittedResponse = response.split(', ');
    const ResCode = splittedResponse[0];
    const RefId = splittedResponse[1];

    if (ResCode.toString() !== '0') {
      throw new RequestException(API.errors[response[0]]);
    }

    return this.makeRequestInfo(RefId, 'POST', this.getLinks().PAYMENT, {
      RefId,
    });
  };

  verifyPayment = async (_options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    const { RefId, ResCode, saleOrderId, SaleReferenceId, CardHolderPan } = params;
    const { terminalId, username, password } = this.config;

    if (ResCode !== '0') {
      throw new PaymentException(API.errors[ResCode]);
    }

    const soapClient = await soap.createClientAsync(this.getLinks().VERIFICATION);

    const requestFields: API.VerifyPaymentReq = {
      terminalId,
      userName: username,
      userPassword: password,
      orderId: saleOrderId,
      saleOrderId: saleOrderId,
      saleReferenceId: SaleReferenceId,
    };

    // 1. Verify
    const verifyResponse: API.VerifyPaymentRes = soapClient.bpVerifyRequest(requestFields);

    if (verifyResponse.toString() !== '0') {
      if (verifyResponse.toString() !== '43') {
        soapClient.bpReversalRequest(requestFields);
      }
      throw new VerificationException(API.errors[verifyResponse]);
    }

    // 2. Settle
    const settleResponse = soapClient.bpSettleRequest(requestFields);
    if (settleResponse.toString() !== '0') {
      if (settleResponse.toString() !== '45' && settleResponse.toString() !== '48') {
        soapClient.bpReversalRequest(requestFields);
      }
      throw new VerificationException(API.errors[verifyResponse]);
    }

    return {
      transactionId: RefId,
      cardPan: CardHolderPan,
      raw: params,
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

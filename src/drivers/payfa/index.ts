import axios from 'axios';
import { Driver } from '../../driver';
import { RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export class Payfa extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.tConfig);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.tRequestOptions);

    const { amount, callbackUrl, description, mobileNumber, cardNumber, invoiceId } = options;

    let response;

    try {
      response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(
        this.getLinks().REQUEST,
        {
          amount,
          callbackUrl,
          description,
          mobileNumber,
          cardNumber,
          invoiceId,
        },
        {
          headers: this.getHeaders(),
        },
      );
    } catch (error) {
      throw new RequestException(error.response.data.message);
    }

    const { paymentId } = response.data;

    return this.makeRequestInfo(paymentId, 'GET', this.getLinks().PAYMENT + paymentId);
  };

  verifyPayment = async (_options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    const { paymentId, isSucceed } = params;

    let response;
    try {
      response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
        this.getLinks().VERIFICATION + paymentId,
        {},
        { headers: this.getHeaders() },
      );
    } catch (error) {
      throw new VerificationException(error.response.data.message);
    }

    const { transactionId, cardNo } = response.data;

    return {
      raw: response.data,
      transactionId: transactionId,
      cardPan: cardNo,
    };
  };

  protected getHeaders() {
    return {
      'X-API-Key': this.config.apiKey,
    };
  }
}

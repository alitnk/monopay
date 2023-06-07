import axios from 'axios';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export class IdPay extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.tConfig);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.tRequestOptions);

    const { amount, callbackUrl, mobile, email, description, name } = options;

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(
      this.getLinks().REQUEST,
      {
        amount: amount,
        callback: callbackUrl,
        mail: email,
        phone: mobile,
        order_id: this.generateUuid(),
        name,
        desc: description,
      },
      {
        headers: this.getHeaders(),
      },
    );

    if ('error_message' in response.data) {
      const error = response.data as API.RequestPaymentRes_Failed;
      throw new RequestException(API.errors[error.error_code.toString()]);
    }

    return this.makeRequestInfo(response.data.id, 'GET', response.data.link);
  };

  verifyPayment = async (
    _options: API.VerifyOptions,
    params: API.CallbackParams_GET | API.CallbackParams_POST,
  ): Promise<API.Receipt> => {
    const { id, order_id, status } = params;

    if (status.toString() !== '10') {
      throw new PaymentException(API.callbackErrors[status.toString()]);
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
      this.getLinks().VERIFICATION,
      {
        order_id,
        id,
      },
      {
        headers: this.getHeaders(),
      },
    );

    if ('error_message' in response.data) {
      throw new VerificationException(API.callbackErrors[response.data.error_code.toString()]);
    }

    return {
      transactionId: response.data.track_id,
      cardPan: response.data.payment.card_no,
      raw: response.data,
    };
  };

  protected getHeaders() {
    return {
      'X-SANDBOX': this.config.sandbox ? '1' : '0',
      'X-API-KEY': this.config.apiKey,
    };
  }
}

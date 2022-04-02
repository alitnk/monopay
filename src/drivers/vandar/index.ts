import axios from 'axios';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export class Vandar extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.tConfig);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.tRequestOptions);

    const { amount, callbackUrl, ...otherOptions } = options;
    const { api_key } = this.config;

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(
      this.getLinks().REQUEST,
      {
        api_key,
        amount: amount,
        callback_url: callbackUrl,
        ...otherOptions,
      },
      {
        validateStatus: () => true,
      },
    );
    const { errors, token } = response.data;

    if (errors?.length) {
      throw new RequestException(errors.join('\n'));
    }

    return this.makeRequestInfo(token, 'GET', this.getLinks().PAYMENT + response.data.token);
  };

  verifyPayment = async (options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    options = this.getParsedData(options, API.tVerifyOptions);

    const { token, payment_status } = params;
    const { api_key } = this.config;

    if (payment_status !== 'OK') {
      throw new PaymentException();
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
      this.getLinks().VERIFICATION,
      {
        api_key,
        token,
      },
      {
        validateStatus: () => true,
      },
    );
    const { errors, transId, cardNumber } = response.data;

    if (errors?.length) {
      throw new VerificationException(errors.join('\n'));
    }

    return {
      transactionId: transId,
      cardPan: cardNumber,
      raw: {
        token,
        payment_status,
      },
    };
  };

  protected getLinks() {
    return this.links.default;
  }
}

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

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(this.getLinks().REQUEST, {
      api_key,
      amount: amount,
      callback_url: callbackUrl,
      ...otherOptions,
    });
    const { token, errors } = response.data;

    if (token?.length) {
      return this.makeRequestInfo(token, 'GET', this.getLinks().PAYMENT + response.data.token);
    }

    if (errors?.length) {
      throw new RequestException(errors.join('\n'));
    }

    throw new RequestException();
  };

  verifyPayment = async (options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    options = this.getParsedData(options, API.tVerifyOptions);

    const { token, payment_status } = params;
    // const { amount } = options;
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
      {},
    );
    const { errors } = response.data;

    if ([0, 1].includes(response.data.status) && response.data.transId !== undefined) {
      return {
        transactionId: response.data.transId,
        cardPan: response.data.cardNumber,
        raw: {
          token,
          payment_status,
        },
      };
    }

    if (errors?.length) {
      // There are errors (`errors` is an object)
      throw new VerificationException(errors.join('\n'));
    }

    throw new VerificationException();
  };

  protected getLinks() {
    return this.links.default;
  }
}

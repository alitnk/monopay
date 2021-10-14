import axios from 'axios';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export class Zarinpal extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.tConfig);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.tRequestOptions);

    const { amount, callbackUrl, mobile, email, ...otherOptions } = options;
    const { merchantId } = this.config;

    let response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(this.getLinks().REQUEST, {
      merchant_id: merchantId,
      amount: amount,
      callback_url: callbackUrl,
      metadata: { email, mobile },
      ...otherOptions,
    });
    const { data, errors } = response.data;

    if (!Array.isArray(data) && !!data) {
      // It was successful (`data` is an object)
      return this.makeRequestInfo(data.authority, 'GET', this.getLinks().PAYMENT + data.authority);
    }

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      const { code } = errors;
      throw new RequestException(API.requestErrors[code.toString()]);
    }
    throw new RequestException();
  };

  verifyPayment = async (options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    options = this.getParsedData(options, API.tVerifyOptions);

    const { Authority: authority, Status: status } = params;
    const { amount } = options;
    const { merchantId } = this.config;

    if (status !== 'OK') {
      throw new PaymentException();
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
      this.getLinks().VERIFICATION,
      {
        authority: authority.toString(),
        merchant_id: merchantId,
        amount: amount,
      },
      {}
    );
    const { data, errors } = response.data;

    if (!Array.isArray(data)) {
      // It was successful (`data` is an object)
      return {
        transactionId: data.ref_id,
        cardPan: data.card_pan,
        raw: data,
      };
    }

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      const { code } = errors;
      throw new VerificationException(API.verifyErrors[code.toString()]);
    }

    throw new VerificationException();
  };

  protected getLinks() {
    return this.config.sandbox ? this.links.sandbox : this.links.default;
  }
}

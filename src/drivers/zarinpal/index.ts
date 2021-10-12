import axios from 'axios';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import { Requestish } from '../../types';
import * as API from './api';

export class Zarinpal extends Driver<API.Config> {
  afterConfigUpdate = (config: API.Config) => {
    if (config.sandbox) this.setLinkStrategy('sandbox');
  };

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    const { amount, callbackUrl, mobile, email, ...otherOptions } = options;
    const { merchantId } = this.config;

    let response = await axios.post<API.PurchaseRequest, { data: API.PurchaseResponse }>(this.getLinks().REQUEST, {
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

  verifyPayment = async (options: API.VerifyOptions, request: Requestish<API.CallbackParams>): Promise<API.Receipt> => {
    const { Authority: authority, Status: status } = request.query;
    const { amount } = options;
    const { merchantId } = this.config;

    if (status !== 'OK') {
      throw new PaymentException();
    }

    const response = await axios.post<API.VerifyRequest, { data: API.VerifyResponse }>(
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
}

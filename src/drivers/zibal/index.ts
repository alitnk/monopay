import { Driver } from '../../driver';
import * as API from './api';
import axios from 'axios';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';

export class Zibal extends Driver<API.Config> {
  afterConfigUpdate = (config: API.Config) => {
    if (config.sandbox) this.config.merchantId = 'zibal';
  };

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    let { amount, ...otherOptions } = options;
    const { merchantId } = this.config;

    const response = await axios.post<API.PurchaseRequest, { data: API.PurchaseResponse }>(this.getLinks().REQUEST, {
      merchant: merchantId,
      amount: amount,
      ...otherOptions,
    });
    const { result, trackId } = response.data;

    if (result !== 100) {
      throw new RequestException(API.purchaseErrors[result.toString()]);
    }

    return this.makeRequestInfo(trackId, 'GET', this.getLinks().PAYMENT + trackId);
  };

  verifyPayment = async (_options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    const { status, success, trackId } = params;
    let { merchantId } = this.config;

    if (success === '0') {
      throw new PaymentException(API.CallbackErrors[status]);
    }

    const response = await axios.post<API.VerifyRequest, { data: API.VerifyResponse }>(this.getLinks().VERIFICATION, {
      merchant: merchantId,
      trackId: +trackId,
    });

    const { result } = response.data;

    if (result !== 100) {
      throw new VerificationException(API.verifyErrors[result.toString()]);
    }

    return {
      raw: response.data,
      transactionId: response.data.refNumber,
      cardPan: response.data.cardNumber,
    };
  };
}

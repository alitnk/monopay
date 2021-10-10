import axios from 'axios';
import { PolypayException, RequestException } from '../../exception';
import { PaymentInfo } from '../../types';
import * as API from './api';
import { ZibalPurchaseOptions } from './types';

export const request = async (options: ZibalPurchaseOptions): Promise<PaymentInfo> => {
  let { amount, merchantId, sandbox, ...otherOptions } = options;

  if (sandbox) merchantId = 'zibal';

  try {
    const response = await axios.post<API.PurchaseRequest, { data: API.PurchaseResponse }>(API.links.default.REQUEST, {
      merchant: merchantId,
      amount: amount * 10,
      ...otherOptions,
    });
    const { result, payLink, trackId } = response.data;

    if (result !== 100) {
      throw new RequestException(API.purchaseErrors[result.toString()]);
    }

    return {
      url: payLink || API.links.default.PAYMENT + trackId,
      method: 'GET',
      params: {},
    };
  } catch (e) {
    if (e instanceof PolypayException) throw e;
    else if (e instanceof Error) throw new RequestException(e.message);
    else throw new Error('Unknown error happened');
  }
};

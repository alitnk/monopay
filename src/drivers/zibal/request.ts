import axios from 'axios';
import { PaymentException } from '../../exception';
import { PaymentInfo } from '../../types';
import { zibalLinks, zibalPurchaseErrors, ZibalPurchaseRequest, ZibalPurchaseResponse } from './api';
import { ZibalPurchaseOptions } from './types';

export const request = async (options: ZibalPurchaseOptions): Promise<PaymentInfo> => {
  let { amount, merchantId, sandbox, ...otherOptions } = options;

  if (sandbox) merchantId = 'zibal';

  try {
    const response = await axios.post<ZibalPurchaseRequest, { data: ZibalPurchaseResponse }>(
      zibalLinks.default.REQUEST,
      { merchant: merchantId, amount: amount * 10, ...otherOptions }
    );
    const { result, payLink, trackId } = response.data;

    if (result !== 100) {
      throw new PaymentException(zibalPurchaseErrors[result.toString()]);
    }

    return {
      url: payLink || zibalLinks.default.PAYMENT + trackId,
      method: 'GET',
      params: {},
    };
  } catch (e) {
    if (e instanceof PaymentException) throw e;
    else if (e instanceof Error) throw new PaymentException(e.message);
    else throw new Error('Unknown error happened');
  }
};

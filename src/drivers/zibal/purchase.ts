import axios from 'axios';
import { PaymentException } from '../../exception';
import { PurchaseInfo } from '../../types';
import { zibalLinks, zibalPurchaseErrors, ZibalPurchaseRequest, ZibalPurchaseResponse } from './api';
import { ZibalPurchaseOptions } from './types';

export const purchase = async (options: ZibalPurchaseOptions): Promise<PurchaseInfo> => {
  let { amount, merchantId, sandbox, ...otherOptions } = options;

  if (sandbox) merchantId = 'zibal';

  try {
    const response = await axios.post<ZibalPurchaseRequest, { data: ZibalPurchaseResponse }>(
      zibalLinks.default.REQUEST,
      { merchant: merchantId, amount: amount * 10, ...otherOptions }
    );
    const { message, result, payLink, trackId } = response.data;

    if (result !== 100) {
      throw new PaymentException(message, zibalPurchaseErrors[result.toString()]);
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

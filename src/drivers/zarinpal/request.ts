import axios from 'axios';
import { RequestException, PolypayException } from '../../exception';
import { PaymentInfo } from '../../types';
import * as API from './api';
import { ZarinpalPurchaseOptions } from './types';
import { getZarinpalLinks } from './utils';

export const request = async (options: ZarinpalPurchaseOptions): Promise<PaymentInfo> => {
  const { sandbox, merchantId, amount, callbackUrl, mobile, email, ...otherOptions } = options;
  let response;

  try {
    response = await axios.post<API.PurchaseRequest, { data: API.PurchaseResponse }>(
      getZarinpalLinks(sandbox).REQUEST,
      {
        merchant_id: merchantId,
        amount: amount * 10, // convert toman to rial
        callback_url: callbackUrl,
        metadata: { email, mobile },
        ...otherOptions,
      }
    );
    const { data, errors } = response.data;

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      const { code } = errors;
      throw new RequestException(API.requestErrors[code.toString()]);
    }

    return {
      url: (getZarinpalLinks(sandbox).PAYMENT + (data as any).authority) as string,
      method: 'GET',
      params: {},
    };
  } catch (e) {
    if (e instanceof PolypayException) throw e;
    else if (e instanceof Error) throw new RequestException(e.message);
    else throw new Error('Unknown error happened');
  }
};

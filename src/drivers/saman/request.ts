import { PaymentInfo } from '../../types';
import { RequestException } from '../../exception';
import { SamanPurchaseOptions } from './types';
import * as API from './api';
import axios from 'axios';

export const request = async (options: SamanPurchaseOptions): Promise<PaymentInfo> => {
  const { merchantId, amount, callbackUrl, mobile, wage } = options;
  const response = await axios.post<API.PurchaseRequest, { data: API.PurchaseResponse }>(API.links.default.REQUEST, {
    Amount: amount,
    RedirectURL: callbackUrl,
    CellNumber: mobile,
    TerminalId: merchantId,
    Action: 'token',
    Wage: wage,
  });

  if (response.data.status !== 1 && response.data.errorCode !== undefined) {
    throw new RequestException(API.purchaseErrors[response.data.errorCode.toString()]);
  }

  return {
    method: 'POST',
    url: API.links.default.PAYMENT,
    params: {
      Token: response.data.token,
      GetMethod: true,
    },
  };
};

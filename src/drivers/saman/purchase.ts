import { PurchaseInfo } from '../../types';
import { PaymentException } from '../../exception';
import { SamanPurchaseOptions } from './types';
import { samanLinks, samanPurchaseErrors, SamanPurchaseRequest, SamanPurchaseResponse } from './api';
import axios from 'axios';

// GetMethod = true
export const purchase = async (options: SamanPurchaseOptions): Promise<PurchaseInfo> => {
  const { merchantId, amount, callbackUrl, mobile, wage } = options;
  const response = await axios.post<SamanPurchaseRequest, { data: SamanPurchaseResponse }>(samanLinks.default.REQUEST, {
    Amount: amount,
    RedirectURL: callbackUrl,
    CellNumber: mobile,
    TerminalId: merchantId,
    Action: 'token',
    Wage: wage,
  });

  if (response.data.status !== 1 && response.data.errorCode !== undefined) {
    throw new PaymentException(samanPurchaseErrors[response.data.errorCode.toString()]);
  }

  return {
    method: 'POST',
    url: samanLinks.default.PAYMENT,
    params: {
      Token: response.data.token,
      GetMethod: true,
    },
  };
};

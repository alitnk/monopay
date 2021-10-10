import { PurchaseOptions, Receipt, VerifyOptions } from '../../types';
import * as API from './api';

export interface SamanOptions {
  merchantId: string;
}

export interface SamanPurchaseOptions extends PurchaseOptions, SamanOptions {
  mobile?: string;
  wage?: number;
}

export interface SamanVerifyOptions extends VerifyOptions, SamanOptions {}

export interface SamanReceipt extends Receipt {
  raw: API.CallbackParams;
}

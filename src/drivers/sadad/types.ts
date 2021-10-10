import { RequestOptions, Receipt, VerifyOptions } from '../../types';
import * as API from './api';

export interface SadadOptions {
  merchantId: string;
  terminalId: string;
  terminalKey: string;
}

export interface SadadPurchaseOptions extends RequestOptions, SadadOptions {
  mobile?: string;
  multiplexingData?: API.MultiplexingObject;
  appName?: string;
}

export interface SadadVerifyOptions extends VerifyOptions, SadadOptions {}

export interface SadadReceipt extends Receipt {
  raw: API.CallbackParams;
}

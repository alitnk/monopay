import { PurchaseOptions, Receipt, VerifyOptions } from '../../types';
import { ZibalMultiplexingObject, ZibalVerifyResponse } from './api';

export interface ZibalOptions {
  sandbox?: boolean;
  merchantId: string;
}
export interface ZibalPurchaseOptions extends PurchaseOptions, ZibalOptions {
  mobile?: string;
  orderId?: string;
  allowedCards?: string[];
  linkToPay?: boolean;
  sms?: boolean;
  percentMode?: 0 | 1;
  feeMode?: 0 | 1 | 2;
  multiplexingInfos?: ZibalMultiplexingObject[];
}

export interface ZibalVerifyOptions extends VerifyOptions, ZibalOptions {}

/**
 * @link https://docs.zibal.ir/IPG/API#verify
 */
export interface ZibalReceipt extends Receipt {
  raw: ZibalVerifyResponse;
}

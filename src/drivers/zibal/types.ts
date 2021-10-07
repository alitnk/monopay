import { Invoice } from '../../invoice';
import { ZibalMultiplexingObject } from './api';

export interface ZibalInvoice extends Invoice {
  mobile?: string;
  orderId?: string;
  allowedCards?: string[];
  linkToPay?: boolean;
  sms?: boolean;
  percentMode?: 0 | 1;
  feeMode?: 0 | 1 | 2;
  multiplexingInfos?: ZibalMultiplexingObject[];
}

import { Verifier } from '../../verifier';

export interface ZibalVerifier extends Verifier {}

import { Receipt } from '../../receipt';
import { ZibalVerifyResponse } from './api';

/**
 * @link https://docs.zibal.ir/IPG/API#verify
 */
export interface ZibalReceipt extends Receipt {
  raw: ZibalVerifyResponse;
}

export type ZibalStrategyType = 'default' | 'sandbox';

export const ZibalDefaultStrategy: ZibalStrategyType = 'default';

export class ZibalOptions {
  strategy: ZibalStrategyType = 'default';
}

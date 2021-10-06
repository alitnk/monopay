import { Receipt } from '../../receipt';
import { ZibalVerifyResponse } from './api';

/**
 * @link https://docs.zibal.ir/IPG/API#verify
 */
export interface ZibalReceipt extends Receipt {
  raw: ZibalVerifyResponse;
}

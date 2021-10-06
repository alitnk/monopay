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

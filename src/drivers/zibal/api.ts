import { Invoice } from '../../invoice';

const zibalLinks = {
  normal: {
    PURCHASE: 'https://gateway.zibal.ir/v1/request',
    VERIFICATION: 'https://gateway.zibal.ir/v1/verify',
    PAYMENT: 'https://gateway.zibal.ir/start/',
  },
};

export interface ZibalVerificationObject {
  paidAt: string;
  cardNumber: string;
  status: number;
  amount: string;
  refNumber: number;
  description: string;
  orderId: string;
  result: number;
  message: string;
}

export interface ZibalInvoice extends Invoice {
  mobile?: string;
  orderId?: string;
  allowedCards?: string[];
  linkToPay?: boolean;
  sms?: boolean;
  percentMode?: 0 | 1;
  feeMode?: 0 | 1 | 2;
  multiplexingInfos?: ZibalMultiplexingObject;
}
/**
 * @link https://docs.zibal.ir/IPG/API#MultiplexingInfo-object
 */
export interface ZibalMultiplexingObject {
  bankAccount?: string;
  subMerchantId?: string;
  walletID?: string;
  amount?: number;
  wagePayer?: boolean;
}

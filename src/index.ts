import * as zarinpal from './drivers/zarinpal';
import * as zibal from './drivers/zibal';
import { Receipt } from './receipt';
import { Invoice } from './invoice';
import { Requestish } from './utils';
import { Verifier } from './verifier';

type DriverName = 'zarinpal' | 'zibal';

export type PurchaseFunction = (invoice: Invoice, options?: any) => Promise<string>;
export type VerifyFunction = (fields: Omit<Verifier, 'code'>, request: Requestish, options?: any) => Promise<Receipt>;
export type VerifyManuallyFunction = (fields: Verifier, options?: any) => Promise<Receipt>;

export interface Driver {
  purchase(invoice: Invoice): Promise<string>;
  verify(object: any, req: Requestish): Promise<Receipt>;
  verifyManually(object: any): Promise<Receipt>;
}

export const polypay = (driver: DriverName) => {
  const map = {
    zarinpal: {
      purchase: zarinpal.purchase,
      verify: zarinpal.verify,
      verifyManually: zarinpal.verifyManually,
    },
    zibal: {
      purchase: zibal.purchase,
      verify: zibal.verify,
      verifyManually: zibal.verifyManually,
    },
  };
  return map[driver];
};

export * from './receipt';
export * from './invoice';

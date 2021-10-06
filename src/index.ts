import * as zarinpal from './drivers/zarinpal';
import { Receipt } from './receipt';
import { Invoice } from './invoice';
import { ExpressLikeRequest } from './utils';

type DriverName = 'zarinpal';

export interface Driver {
  purchase(invoice: Invoice): Promise<string>;
  verify(object: any, req: ExpressLikeRequest): Promise<Receipt>;
  verifyManually(object: any): Promise<Receipt>;
}

export const polypay = (driver: DriverName) => {
  const map: Record<DriverName, Driver> = {
    zarinpal: {
      purchase: zarinpal.purchase,
      verify: zarinpal.verify,
      verifyManually: zarinpal.verifyManually,
    },
  };
  return map[driver];
};

export * from './receipt';
export * from './invoice';

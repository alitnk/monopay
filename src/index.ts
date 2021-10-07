import * as drivers from './drivers';
import { Invoice } from './invoice';
import { Receipt } from './receipt';
import { Requestish } from './utils';

type DriverName = 'zarinpal' | 'zibal';
type Driver = {
  purchase(invoice: Invoice): Promise<string>;
  verify(object: any, req: Requestish): Promise<Receipt>;
  verifyManually(object: any): Promise<Receipt>;
};

/**
 * NOTE: You do not have type safety for driver-specific options with this method.
 * This method is used for when you want to let user decide which driver to use.
 * If you solely want to use one driver, import the driver explicitly.
 *
 * @param driver Enter a driver name (e.g. zarinpal)
 * @returns A driver with `purchase` and `verify` on it
 */
export const getPaymentDriver = (driver: DriverName): Driver => {
  return drivers[driver];
};

export * from './drivers';
export * from './exception';

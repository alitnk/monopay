import * as drivers from './drivers';
import { PurchaseOptions } from './options';
import { Receipt } from './receipt';
import { Requestish } from './utils';
import { VerifyOptions } from './options';
import { ZarinpalOptions } from './drivers/zarinpal/types';
import { ZibalOptions } from './drivers/zibal/types';

export type ConfigObject = {
  zarinpal: ZarinpalOptions;
  zibal: ZibalOptions;
};

type Driver = {
  purchase(options: PurchaseOptions): Promise<string>;
  verify(options: Omit<VerifyOptions, 'code'>, req: Requestish): Promise<Receipt>;
  verifyManually(options: VerifyOptions): Promise<Receipt>;
};

/**
 * The "inclusive" API
 *
 * This method is used for when you want to let user decide which driver to use.
 * If you solely want to use one driver, import the driver explicitly.
 *
 * @param driver Enter a driver name (e.g. zarinpal)
 * @returns A driver with `purchase` and `verify` on it
 */
export const getPaymentDriver = (driverName: keyof ConfigObject, ConfigObject: Partial<ConfigObject>): Driver => {
  const driver: Driver = drivers[driverName];
  if (ConfigObject) {
    const config = ConfigObject[driverName] || {};
    driver.purchase = (options: PurchaseOptions) => driver.purchase({ ...config, ...options });
    driver.verify = (options: Omit<VerifyOptions, 'code'>, req: Requestish) =>
      driver.verify({ ...config, ...options }, req);
    driver.verifyManually = (options: VerifyOptions) => driver.verifyManually({ ...config, ...options });
  }
  return driver;
};

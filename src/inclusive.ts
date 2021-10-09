import * as drivers from './drivers';
import { SamanOptions } from './drivers/saman/types';
import { ZarinpalOptions } from './drivers/zarinpal/types';
import { ZibalOptions } from './drivers/zibal/types';
import { PurchaseInfo, PurchaseOptions, Receipt, VerifyOptions } from './types';
import { Requestish } from './utils';

export type ConfigObject = {
  zarinpal: ZarinpalOptions;
  zibal: ZibalOptions;
  saman: SamanOptions;
};

type Driver = {
  purchase(options: PurchaseOptions): Promise<PurchaseInfo>;
  verify(options: VerifyOptions, req: Requestish): Promise<Receipt>;
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
    driver.verify = (options: VerifyOptions, req: Requestish) => driver.verify({ ...config, ...options }, req);
  }
  return driver;
};

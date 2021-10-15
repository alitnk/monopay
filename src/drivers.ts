import { Driver as BaseDriver } from './driver';
import { IdPay } from './drivers/idpay';
import * as IdPayAPI from './drivers/idpay/api';
import { NextPay } from './drivers/nextpay';
import * as NextPayAPI from './drivers/nextpay/api';
import { Payir } from './drivers/payir';
import * as PayirAPI from './drivers/payir/api';
import { Sadad } from './drivers/sadad';
import * as SadadAPI from './drivers/sadad/api';
import { Saman } from './drivers/saman';
import * as SamanAPI from './drivers/saman/api';
import { Zarinpal } from './drivers/zarinpal';
import * as ZarinpalAPI from './drivers/zarinpal/api';
import { Zibal } from './drivers/zibal';
import * as ZibalAPI from './drivers/zibal/api';

export { IdPay } from './drivers/idpay';
export { NextPay } from './drivers/nextpay';
export { Sadad } from './drivers/sadad';
export { Saman } from './drivers/saman';
export { Zarinpal } from './drivers/zarinpal';
export { Zibal } from './drivers/zibal';
interface ConfigMap {
  idpay: IdPayAPI.Config;
  nextpay: NextPayAPI.Config;
  payir: PayirAPI.Config;
  sadad: SadadAPI.Config;
  saman: SamanAPI.Config;
  zarinpal: ZarinpalAPI.Config;
  zibal: ZibalAPI.Config;
}

export type ConfigObject = Partial<ConfigMap>;

export type DriverName = keyof ConfigMap;

const drivers = {
  idpay: IdPay,
  nextpay: NextPay,
  payir: Payir,
  sadad: Sadad,
  saman: Saman,
  zarinpal: Zarinpal,
  zibal: Zibal,
};

export const getPaymentDriver = <Driver extends BaseDriver>(
  driverName: DriverName,
  config: Parameters<Driver['setConfig']>[0]
): Driver => {
  if (!drivers[driverName]) {
    throw Error(`This driver is not supported, supported drivers: ${Object.keys(drivers).join(', ')}`);
  }

  const driver = drivers[driverName];

  return (new driver(config) as unknown) as Driver;
};

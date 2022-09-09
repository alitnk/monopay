import { Driver as BaseDriver } from './driver';
import { Behpardakht } from './drivers/behpardakht';
import * as BehpardakhtAPI from './drivers/behpardakht/api';
import { IdPay } from './drivers/idpay';
import * as IdPayAPI from './drivers/idpay/api';
import { NextPay } from './drivers/nextpay';
import * as NextPayAPI from './drivers/nextpay/api';
import { Parsian } from './drivers/parsian';
import * as ParsianAPI from './drivers/parsian/api';
import { Pasargad } from './drivers/pasargad';
import * as PasargadAPI from './drivers/pasargad/api';
import { Payir } from './drivers/payir';
import * as PayirAPI from './drivers/payir/api';
import { PayPing } from './drivers/payping';
import * as PayPingAPI from './drivers/payping/api';
import { Sadad } from './drivers/sadad';
import * as SadadAPI from './drivers/sadad/api';
import { Saman } from './drivers/saman';
import * as SamanAPI from './drivers/saman/api';
import { Vandar } from './drivers/vandar';
import * as VandarAPI from './drivers/vandar/api';
import { Zarinpal } from './drivers/zarinpal';
import * as ZarinpalAPI from './drivers/zarinpal/api';
import { Zibal } from './drivers/zibal';
import * as ZibalAPI from './drivers/zibal/api';

export { Behpardakht } from './drivers/behpardakht';
export { IdPay } from './drivers/idpay';
export { NextPay } from './drivers/nextpay';
export { Parsian } from './drivers/parsian';
export { Pasargad } from './drivers/pasargad';
export { Payir } from './drivers/payir';
export { PayPing } from './drivers/payping';
export { Sadad } from './drivers/sadad';
export { Saman } from './drivers/saman';
export { Vandar } from './drivers/vandar';
export { Zarinpal } from './drivers/zarinpal';
export { Zibal } from './drivers/zibal';
interface ConfigMap {
  behpardakht: BehpardakhtAPI.Config;
  idpay: IdPayAPI.Config;
  nextpay: NextPayAPI.Config;
  payir: PayirAPI.Config;
  parsian: ParsianAPI.Config;
  pasargad: PasargadAPI.Config;
  payping: PayPingAPI.Config;
  sadad: SadadAPI.Config;
  saman: SamanAPI.Config;
  vandar: VandarAPI.Config;
  zarinpal: ZarinpalAPI.Config;
  zibal: ZibalAPI.Config;
}

export type ConfigObject = Partial<ConfigMap>;

export type DriverName = keyof ConfigMap;

const drivers = {
  behpardakht: Behpardakht,
  idpay: IdPay,
  nextpay: NextPay,
  payir: Payir,
  parsian: Parsian,
  pasargad: Pasargad,
  payping: PayPing,
  sadad: Sadad,
  saman: Saman,
  vandar: Vandar,
  zarinpal: Zarinpal,
  zibal: Zibal,
};

export const getPaymentDriver = <Driver extends BaseDriver>(
  driverName: DriverName,
  config: Parameters<Driver['setConfig']>[0],
): Driver => {
  if (!drivers[driverName]) {
    throw Error(`This driver is not supported, supported drivers: ${Object.keys(drivers).join(', ')}`);
  }

  const driver = drivers[driverName];

  return new driver(config) as unknown as Driver;
};

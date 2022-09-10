import { Behpardakht, BehpardakhtAPI } from 'drivers/behpardakht';
import { IdPay, IdPayAPI } from 'drivers/idpay';
import { NextPay, NextPayAPI } from 'drivers/nextpay';
import { Parsian, ParsianAPI } from 'drivers/parsian';
import { Pasargad, PasargadAPI } from 'drivers/pasargad';
import { Payir, PayirAPI } from 'drivers/payir';
import { PayPing, PayPingAPI } from 'drivers/payping';
import { Sadad, SadadAPI } from 'drivers/sadad';
import { Saman, SamanAPI } from 'drivers/saman';
import { Vandar, VandarAPI } from 'drivers/vandar';
import { Zarinpal, ZarinpalAPI } from 'drivers/zarinpal';
import { Zibal, ZibalAPI } from 'drivers/zibal';
import { Driver as BaseDriver } from './driver';

export { Behpardakht } from './drivers/behpardakht/behpardakht';
export { IdPay } from './drivers/idpay/idpay';
export { NextPay } from './drivers/nextpay/nextpay';
export { Parsian } from './drivers/parsian/parsian';
export { Pasargad } from './drivers/pasargad/pasargad';
export { Payir } from './drivers/payir/payir';
export { PayPing } from './drivers/payping/payping';
export { Sadad } from './drivers/sadad/sadad';
export { Saman } from './drivers/saman/saman';
export { Vandar } from './drivers/vandar/vandar';
export { Zarinpal } from './drivers/zarinpal/zarinpal';
export { Zibal } from './drivers/zibal/zibal';
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

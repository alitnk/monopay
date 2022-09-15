import { createBehpardakhtDriver } from './drivers/behpardakht';
import { createIdpayDriver } from './drivers/idpay';
import { createNextpayDriver } from './drivers/nextpay';
import { createParsianDriver } from './drivers/parsian';
import { createPasargadDriver } from './drivers/pasargad';
import { createPayirDriver } from './drivers/payir';
import { createPaypingDriver } from './drivers/payping';
import { createSadadDriver } from './drivers/sadad';
import { createSamanDriver } from './drivers/saman';
import { createVandarDriver } from './drivers/vandar';
import { createZarinpalDriver } from './drivers/zarinpal';
import { createZibalDriver } from './drivers/zibal';

export type { BehpardakhtAPI, BehpardakhtDriver } from './drivers/behpardakht';
export type { IdpayAPI, IdpayDriver } from './drivers/idpay';
export type { NextpayAPI, NextpayDriver } from './drivers/nextpay';
export type { ParsianAPI, ParsianDriver } from './drivers/parsian';
export type { PasargadAPI, PasargadDriver } from './drivers/pasargad';
export type { PayirAPI, PayirDriver } from './drivers/payir';
export type { PaypingAPI, PaypingDriver } from './drivers/payping';
export type { SadadAPI, SadadDriver } from './drivers/sadad';
export type { SamanAPI, SamanDriver } from './drivers/saman';
export type { VandarAPI, VandarDriver } from './drivers/vandar';
export type { ZarinpalAPI, ZarinpalDriver } from './drivers/zarinpal';
export type { ZibalAPI, ZibalDriver } from './drivers/zibal';

export const drivers = {
  behpardakht: createBehpardakhtDriver,
  idpay: createIdpayDriver,
  nextpay: createNextpayDriver,
  parsian: createParsianDriver,
  pasargad: createPasargadDriver,
  payir: createPayirDriver,
  payping: createPaypingDriver,
  sadad: createSadadDriver,
  saman: createSamanDriver,
  vandar: createVandarDriver,
  zarinpal: createZarinpalDriver,
  zibal: createZibalDriver,
};

export const getPaymentDriver = <DriverName extends keyof typeof drivers>(driverName: DriverName) => {
  if (!drivers[driverName]) {
    throw Error(`This driver is not supported, supported drivers: ${Object.keys(drivers).join(', ')}`);
  }
  return drivers[driverName];
};

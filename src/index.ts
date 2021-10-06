import { Driver } from './driver';
import * as zarinpal from './drivers/zarinpal';

type DriverName = 'zarinpal';

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

export * from './driver';
export * from './receipt';
export * from './invoice';

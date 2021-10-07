import * as drivers from './drivers';

type DriverName = 'zarinpal' | 'zibal';

export const polypay = (driver: DriverName) => {
  return drivers[driver];
};

export * from './drivers';
export * from './exception';

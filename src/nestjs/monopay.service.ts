import { Inject, Injectable } from '@nestjs/common';
import { drivers, getPaymentDriver } from '../drivers';
import { MonopayModuleOptions } from './interfaces/monopay-module.interface';
import { MONOPAY_OPTIONS } from './monopay.constants';

type Drivers = {
  [DriverName in keyof typeof drivers]: ReturnType<typeof drivers[DriverName]>;
};

@Injectable({})
export class MonopayService {
  private drivers: Drivers = {} as Drivers;

  constructor(@Inject(MONOPAY_OPTIONS) options: MonopayModuleOptions) {
    Object.entries(options).map(([driver, config]) => {
      // https://twitter.com/tannerlinsley/status/1568716269809188864
      this.drivers[driver as keyof Drivers] = getPaymentDriver(driver as any)(config as any);
    });
  }

  getDriver<DriverName extends keyof Drivers>(driverName: DriverName) {
    if (!this.drivers[driverName]) {
      throw new Error(`You haven't provided configurations for the ${driverName} driver and are trying to access it.`);
    }

    return this.drivers[driverName];
  }
}

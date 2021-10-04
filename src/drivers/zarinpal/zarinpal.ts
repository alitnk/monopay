import { IReceipt } from '../../receipt';
import { Driver, DriverWithStrategy } from '../../driver';
import { ZarinpalNormalStrategy } from './strategies/normal.strategy';
import { Type } from '../..';

export abstract class ZarinpalStrategy {
  abstract links: {
    PURCHASE: string;
    PAYMENT: string;
    VERIFICATION: string;
  };

  abstract purchase(): Promise<string>;

  abstract pay(): Promise<string>;

  abstract verify(): Promise<IReceipt>;
}

const strategies: Record<StrategyType, Type<ZarinpalStrategy>> = {
  normal: ZarinpalNormalStrategy,
  sandbox: ZarinpalNormalStrategy,
  zaringate: ZarinpalNormalStrategy,
};

type StrategyType = 'normal' | 'sandbox' | 'zaringate';

export class Zarinpal extends Driver implements DriverWithStrategy<StrategyType> {
  selectedStrategy: StrategyType = 'normal';
  strategyInstance: ZarinpalStrategy;

  constructor() {
    super();
    this.strategyInstance = new strategies[this.selectedStrategy]();
  }

  createStrategyInstance() {
    this.strategyInstance = new strategies[this.selectedStrategy]();
  }

  strategy(strategy: StrategyType) {
    this.selectedStrategy = strategy;
  }

  purchase(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  pay(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  verify(): Promise<IReceipt> {
    throw new Error('Method not implemented.');
  }
}

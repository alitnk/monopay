import { IReceipt } from '../../receipt';
import { Driver, DriverWithStrategy } from '../../driver';
import { ZarinpalNormalStrategy } from './strategies/normal.strategy';
import { Type } from '../../utils';
import { ZarinpalInvoice } from './invoice';
console.log('hey!');

export abstract class ZarinpalStrategy {
  constructor(protected readonly invoice: ZarinpalInvoice) {}

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
  strategyInstance!: ZarinpalStrategy;

  constructor(invoice: ZarinpalInvoice) {
    super(invoice);
    this.createStrategyInstance();
  }

  private createStrategyInstance() {
    this.strategyInstance = new strategies[this.selectedStrategy](this.invoice);
  }

  public strategy(strategy: StrategyType) {
    this.selectedStrategy = strategy;
  }

  public async purchase(): Promise<string> {
    return await this.strategyInstance.purchase();
  }

  public async pay(): Promise<string> {
    return await this.strategyInstance.pay();
  }

  public async verify(): Promise<IReceipt> {
    return await this.strategyInstance.verify();
  }
}

import { IReceipt } from './receipt';

export interface IDriver {
  amount: number | undefined;
  attributes: Record<string, any>;

  setAmount(amount: number): void;

  detail(record: Record<string, any>): Record<string, any>;
  detail(key: string, value: any): Record<string, any>;

  purchase(): Promise<string>;

  pay(): Promise<string>;

  verify(): Promise<IReceipt>;
}

export abstract class Driver implements IDriver {
  amount: number | undefined;
  attributes: Record<string, any> = {};

  setAmount(amount: number): void {
    this.amount = amount;
  }

  detail(record: Record<string, any>): Record<string, any>;
  detail(key: string, value: any): Record<string, any>;

  detail(keyOrRecord: string | Record<string, any>, value?: any): Record<string, any> {
    if (typeof keyOrRecord === 'string') {
      this.attributes[keyOrRecord] = value;
    } else {
      Object.keys(keyOrRecord).forEach(key => (this.attributes[key] = keyOrRecord[key]));
    }

    return this.attributes;
  }

  abstract purchase(): Promise<string>;

  abstract pay(): Promise<string>;

  abstract verify(): Promise<IReceipt>;
}

export abstract class DriverWithStrategy<StrategyType> {
  /**
   * The selected strategy
   */
  abstract selectedStrategy: StrategyType;

  /**
   * Selects the strategy
   * @param strategy chosen strategy
   */
  abstract strategy(strategy: StrategyType): void;
}

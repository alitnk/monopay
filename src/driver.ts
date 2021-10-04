import { Invoice } from './invoice';
import { IReceipt } from './receipt';

export abstract class Driver {
  constructor(protected invoice: Invoice) {}

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

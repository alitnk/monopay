import { Invoice } from './invoice';
import { Receipt } from './receipt';

export interface Driver {
  invoice: Invoice;
  purchase(): Promise<string>;
  pay(): Promise<string>;
  verify(): Promise<Receipt>;
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
  abstract strategy(strategy: StrategyType): DriverWithStrategy<StrategyType>;
}

export type ZarinpalStrategyType = 'default' | 'sandbox';

export const zarinpalDefaultStrategy: ZarinpalStrategyType = 'default';

export class ZarinpalOptions {
  strategy: ZarinpalStrategyType = 'default';
}

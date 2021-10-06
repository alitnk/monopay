export type ZibalStrategyType = 'default' | 'sandbox';

export const ZibalDefaultStrategy: ZibalStrategyType = 'default';

export class ZibalOptions {
  strategy: ZibalStrategyType = 'default';
}

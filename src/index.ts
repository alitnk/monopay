import { getPaymentDriver } from './inclusive';

export * from './drivers';
export * from './inclusive';
export * from './exception';
getPaymentDriver('zarinpal', {
  zarinpal: { sandbox: true, merchantId: '213' },
}).purchase({ amount: 2000, callbackUrl: 'https://google.com' });

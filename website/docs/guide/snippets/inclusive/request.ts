import { getPaymentDriver } from 'polypay.js';
import { polypayConfig } from './polypay-config';

const driver = getPaymentDriver(polypayConfig, userPreferedService);

const paymentUrl = await driver.purchase({
  amount: 50000, // in Toman
  callbackUrl: 'https://my-site.com/callback',
  description: 'Description about the purchase',
});

import { zarinpal } from 'polypay.js';

const paymentUrl = await zarinpal.purchase({
  amount: 50000, // in Toman
  merchantId: 'some-id-you-got-from-the-service',
  callbackUrl: 'https://my-site.com/callback',
  description: 'Description about the purchase',
});
---
sidebar_position: 2
title: 'Requesting For Payment'
---

The first step to make a transaction, is to request for a payment URL.

With polypay, there are 2 ways you can do it.

1. If you work, solely, with one service (e.g. you only use Zarinpal as your payment service)

```ts
import { zarinpal } from 'polypay.js';

const paymentUrl = await zarinpal.purchase({
  amount: 50000, // in Toman
  merchantId: 'some-id-you-got-from-the-service',
  callbackUrl: 'https://my-site.com/callback',
  description: 'Description about the purchase',
});
```

2. You let your user choose the payment service

```ts
import { getPaymentDriver } from 'polypay.js';


// userPreferedService is a payment driver (e.g. `zarinpal`)
const driver = getPaymentDriver(userPreferedService)

const paymentUrl = await driver.purchase({
  amount: 50000, // in Toman
  merchantId: 'some-id-you-got-from-the-service',
  callbackUrl: 'https://my-site.com/callback',
  description: 'Description about the purchase',
});
```
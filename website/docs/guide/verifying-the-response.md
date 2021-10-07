---
sidebar_position: 3
title: 'Verifying The Response'
---

After the user finishes with the paying, the gateway will redirect them back to the callback URL you provided them and that's where you call the `verify` function.

Again, there are 2 ways you can be going for this:

1. If you work, solely, with one service (e.g. you only use Zarinpal as your payment service)

```ts
import { zarinpal } from 'polypay.js';

const receipt = await zarinpal.verify(
  {
    amount: 5000,
    merchantId: 'some-id-you-got-from-the-service',
  },
  request
);
```

2. You let your user choose the payment service

```ts
import { getPaymentDriver } from 'polypay.js';

// userPreferedService is a payment driver (e.g. `zarinpal`)
const driver = getPaymentDriver(userPreferedService);

const receipt = await driver.verify(
  {
    amount: 5000,
    merchantId: 'some-id-you-got-from-the-service',
  },
  request
);
```

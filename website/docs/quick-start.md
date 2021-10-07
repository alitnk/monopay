---
sidebar_position: 3
title: 'Quick Start'
---

This guide will get you up and running in a few minutes!

## Installation

First, install the package:

if you use npm:

```
npm install polypay.js
```

if you use yarn:

```
yarn add polypay.js
```

## Request for payment

Import the payment driver you want and call the `purchase` function on it:

```ts
import { zarinpal } from 'polypay.js';

const paymentUrl = await zarinpal.purchase({
  amount: 50000, // in Toman
  merchantId: 'some-id-you-got-from-the-service',
  callbackUrl: 'https://my-site.com/callback',
  description: 'Description about the purchase',
});
```

This function returns you a URL to the payment gateway. You should redirect the user to the URL.

If the purchasing request fails, it will throw a `PaymentException` that you can catch and act upon.

**Note that this function returns you a promise, so you should either use async/await or resolve it with .then()**

## Verify the payment

Import the payment driver again, and call the `verify` function, when the callback is called:

For the first parameter, you should give it an object, containing the `merchantId` and the `amount` of purchase.

For the second parameter, you should give it the express/fastify/koa Request object. (It must have a `query` field on it.)

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

If the callback call was verified, this function returns you a "Receipt", that will contain the information about transaction.

If the verification fails, this function will throw a `VerificationException` that you can catch and act upon.

**Note that this function also, returns a promise.**

---

And yeah that's about it. here you can see an example of it using express.js:
[Example using express.js](https://github.com/alitnk/polypay.js/blob/main/examples/express-example/index.js)

If you want to know about the other features and dive deeper, check the [full guide](/docs/guide/installation)

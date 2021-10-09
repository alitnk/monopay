---
sidebar_position: 2
title: Payment Procedure
---

If you wanna implement a payment system in your node.js app, first, you should know how payment gateways work.

## 1. Requesting A Payment

You send a request to the payment service"s API, including your credentials (mostly a "merchant ID"), a callback URL, the amount of transaction and some optional fields like description and phone number.

The API returns you either a "reference ID", which you'll use to send your user to the payment page.

## 2. Sending User To Payment Page

This step depends on the service you're working with, and it'll probably fall into one of the below:

1. You just redirect your user to the payment page
2. You'll need to create a form on the frontend and send a POST request on the client

## 3. Callback Verification

Once the user is finished with the payment, the payment service will redirect them back to the URL you provided them earlier. in this step you check the returned info against their API to make sure it's a legit callback and it's actually coming from the payment service.

If the verification was successful, you'll get a `transactionId` that you can show to the user.

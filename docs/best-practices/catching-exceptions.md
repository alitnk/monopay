---
sidebar_position: 1
title: Catching Exceptions
---

Exceptions might be thrown during different parts of transaction.

## Request Exception

If an error occurs in the requesting process, a `RequestException` will be thrown.

## Payment Exception

If an error occurs in the user"s payment process, a `PaymentException` will be thrown.

## Verification Exception

If an error occurs in the verification process, a `VerificationException` will be thrown.

## Polypay Exception

All of the mentioned exceptions extend `PolypayException`. So if you wanted to catch any payment exception, you can just check if they're an instance of `PolypayException`.

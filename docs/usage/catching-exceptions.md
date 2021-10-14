---
sidebar_position: 4
title: Catching Exceptions
---

Exceptions might be thrown during different parts of transaction. To provide your users information when things go wrong, you should catch these exceptions.

## Request Exception

If an error occurs in the requesting process, a `RequestException` will be thrown.

## Payment Exception

If an error occurs in the user"s payment process, a `PaymentException` will be thrown.

## Verification Exception

If an error occurs in the verification process, a `VerificationException` will be thrown.

## Bad Config Exception

If the provided configurations were invalid, a `BadConfigException` will be thrown.

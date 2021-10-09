---
sidebar_position: 7
title: Exceptions
---

Exceptions might be thrown during the different parts of transaction and They'll always contain a user-friendly message in persian.

## Request Exception

If an error occurs in the requesting process, we'll throw a `RequestException`.

## Payment Exception

If an error occurs in the user"s payment process, we'll throw a `PaymentException`.

## Verification Exception

If an error occurs in the verification process, we'll throw a `VerificationException`

## Polypay Exception 

All of the above exceptions, extend `PolypayException`, so if you wanted to catch any payment exception, you can just check if they're an instance of `PolypayException`.

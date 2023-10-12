---
title: Exceptions
description: Explaining the exceptions the package throws
---

Exceptions may be thrown during different parts of transaction. To provide your users information when things go wrong, you should catch these exceptions.

## `BadConfigError`

This error is thrown in two cases:
- If your provided configuration doesn't match the Zod schema for the driver (before even hitting the IPG API)
- If the payment gateway responds with an error status indicating your config is invalid

This error usually means you, the developer, are doing something wrong or have misconfigured a driver.

## `UserError`

This error is thrown when the end-user does something other than going through the provided steps to pay. For example it be that they cancelled the payment.

## `GatewayFailureError`

Denotes an error either caused by a failure from gateway or an unrecognizable reason.

## `MonopayError`

All the above errors extend this error. Sometimes you want to catch all payment-related errors. If you want to do that, you should look for this error.
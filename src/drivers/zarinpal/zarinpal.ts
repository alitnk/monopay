import axios from 'axios';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { BadConfigError, GatewayFailureError, UserError } from '../../exceptions';
import * as API from './api';

const getLinks = (links: { request: string; verify: string; payment: string }, sandbox: boolean) =>
  sandbox
    ? {
        request: 'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
        verify: 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
        payment: 'https://sandbox.zarinpal.com/pg/StartPay/',
      }
    : links;

const throwError = (errorCode: string) => {
  if (API.IPGConfigErrors.includes(errorCode))
    throw new BadConfigError(API.requestErrors[errorCode] ?? API.verifyErrors[errorCode], true);
  if (API.IPGUserErrors.includes(errorCode))
    throw new UserError(API.requestErrors[errorCode] ?? API.verifyErrors[errorCode]);
  throw new GatewayFailureError(API.requestErrors[errorCode] ?? API.verifyErrors[errorCode]);
};

export const createZarinpalDriver = defineDriver({
  schema: {
    config: z.object({
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
      sandbox: z.boolean().optional(),
      merchantId: z.string(),
    }),
    request: z.object({ mobile: z.string().optional(), email: z.string().optional() }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://api.zarinpal.com/pg/v4/payment/request.json',
      verify: 'https://api.zarinpal.com/pg/v4/payment/verify.json',
      payment: 'https://www.zarinpal.com/pg/StartPay/',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, mobile, email, ...otherOptions } = options;
    const { merchantId, sandbox } = ctx;
    const links = getLinks(ctx.links, sandbox ?? false);

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(links.request, {
      merchant_id: merchantId,
      amount: amount,
      callback_url: callbackUrl,
      metadata: { email, mobile },
      ...otherOptions,
    });
    const { data, errors } = response.data;

    if (!Array.isArray(data) && !!data) {
      // It was successful (`data` is an object)
      return {
        method: 'GET',
        referenceId: data.authority,
        url: links.payment + data.authority,
      };
    }

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      throwError(errors.code.toString());
    }
    throw new GatewayFailureError();
  },
  verify: async ({ ctx, options, params }) => {
    const { Authority: authority, Status: status } = params;
    const { amount } = options;
    const { merchantId, sandbox } = ctx;
    const links = getLinks(ctx.links, sandbox ?? false);

    if (status !== 'OK') throw new GatewayFailureError();

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
      links.verify,
      {
        authority: authority.toString(),
        merchant_id: merchantId,
        amount: amount,
      },
      {},
    );
    const { data, errors } = response.data;

    if (!Array.isArray(data)) {
      // It was successful (`data` is an object)
      return {
        transactionId: data.ref_id,
        cardPan: data.card_pan,
        raw: data,
      };
    }

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      throwError(errors.code.toString());
    }

    throw new GatewayFailureError();
  },
});

export type ZarinpalDriver = ReturnType<typeof createZarinpalDriver>;

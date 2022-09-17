import axios from 'axios';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { BadConfigError, PaymentException, RequestException, UserError, VerificationException } from '../../exceptions';
import { generateUuid } from '../../utils/generateUuid';
import * as API from './api';

const getHeaders = (apiKey: string, sandbox: boolean) => ({
  'X-SANDBOX': sandbox ? '1' : '0',
  'X-API-KEY': apiKey,
});

const throwError = (errorCode: string) => {
  if (API.IPGConfigErrors.includes(errorCode))
    throw new BadConfigError(API.errors[errorCode] ?? API.callbackErrors[errorCode], true);
  if (API.IPGUserErrors.includes(errorCode))
    throw new UserError(API.errors[errorCode] ?? API.callbackErrors[errorCode]);
};

export const createIdpayDriver = defineDriver({
  schema: {
    config: z.object({
      links: z.object({
        request: z.string(),
        verify: z.string(),
      }),
      sandbox: z.boolean().nullish(),
      apiKey: z.string(),
    }),
    request: z.object({
      mobile: z.string().optional(),
      email: z.string().optional(),
      name: z.string().optional(),
    }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://api.idpay.ir/v1.1/payment',
      verify: 'https://api.idpay.ir/v1.1/payment/verify',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, mobile, email, description, name } = options;
    const { apiKey, sandbox, links } = ctx;

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(
      links.request,
      {
        amount: amount,
        callback: callbackUrl,
        mail: email,
        phone: mobile,
        order_id: generateUuid(),
        name,
        desc: description,
      },
      {
        headers: getHeaders(apiKey, sandbox ?? false),
      },
    );

    if ('error_message' in response.data) {
      const error = response.data as API.RequestPaymentRes_Failed;
      const errorCode = error.error_code.toString();
      throwError(errorCode);
      throw new RequestException(API.errors[errorCode]);
    }
    return {
      method: 'GET',
      referenceId: response.data.id,
      url: links.verify,
    };
  },
  verify: async ({ ctx, params }) => {
    const { apiKey, links, sandbox } = ctx;
    const { id, order_id, status } = params;
    const statusCode = status.toString();
    if (statusCode !== '200') {
      throwError(statusCode);
      throw new PaymentException(API.callbackErrors[statusCode]);
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
      links.verify,
      {
        order_id,
        id,
      },
      {
        headers: getHeaders(apiKey, sandbox ?? false),
      },
    );

    if ('error_message' in response.data) {
      const errorCode = response.data.error_code.toString();
      throwError(errorCode);
      throw new VerificationException(API.callbackErrors[errorCode]);
    }

    return {
      transactionId: response.data.track_id,
      cardPan: response.data.payment.card_no,
      raw: response.data,
    };
  },
});

export type IdpayDriver = ReturnType<typeof createIdpayDriver>;

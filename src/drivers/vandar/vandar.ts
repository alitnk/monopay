import axios from 'axios';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { GatewayFailureError } from '../../exceptions';
import * as API from './api';

export const createVandarDriver = defineDriver({
  schema: {
    config: z.object({
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
      api_key: z.string(),
    }),
    request: z.object({
      mobile_number: z.string().optional(),
      factorNumber: z.string().optional(),
      description: z.string().optional(),
      valid_card_number: z.string().optional(),
      comment: z.string().optional(),
    }),
    verify: z.object({
      status: z.number().optional(),
      // amount: z.string().optional(),
      realAmount: z.number().optional(),
      wage: z.string().optional(),
      transId: z.number().optional(),
      factorNumber: z.string().optional(),
      mobile: z.string().optional(),
      description: z.string().optional(),
      cardNumber: z.string().optional(),
      paymentDate: z.string().optional(),
      cid: z.string().optional(),
      message: z.string().optional(),
      errors: z.array(z.string()).optional(),
    }),
  },
  defaultConfig: {
    links: {
      request: 'https://ipg.vandar.io/api/v3/send',
      verify: 'https://ipg.vandar.io/api/v3/verify',
      payment: 'https://ipg.vandar.io/v3/',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, ...otherOptions } = options;
    const { api_key, links } = ctx;

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(
      links.request,
      {
        api_key,
        amount: amount,
        callback_url: callbackUrl,
        ...otherOptions,
      },
      {
        validateStatus: () => true,
      },
    );
    const { errors, token } = response.data;

    if (errors?.length) throw new GatewayFailureError(errors.join('\n'));

    if (!token) throw new GatewayFailureError('No token was provided by the IPG');

    return {
      method: 'GET',
      referenceId: token,
      url: links.payment + response.data.token,
    };
  },
  verify: async ({ ctx, options, params }) => {
    const { token, payment_status } = params;
    const { api_key, links } = ctx;

    if (payment_status !== 'OK') throw new GatewayFailureError();

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
      links.verify,

      {
        api_key,
        token,
      },
      {
        validateStatus: () => true,
      },
    );
    const { errors, transId, cardNumber } = response.data;

    if (errors?.length) throw new GatewayFailureError(errors.join('\n'));

    if (transId === undefined) throw new GatewayFailureError('No transaction ID was provided by the IPG');

    return {
      transactionId: transId,
      cardPan: cardNumber,
      raw: {
        token,
        payment_status,
      },
    };
  },
});

export type VandarDriver = ReturnType<typeof createVandarDriver>;

import axios from 'axios';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

const getApiKey = (apiKey: string, sandbox: boolean) => (sandbox ? 'test' : apiKey);

export const createPayirDriver = defineDriver({
  schema: {
    config: z.object({
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
      sandbox: z.boolean().optional(),
      apiKey: z.string(),
    }),
    request: z.object({
      mobile: z.string().optional(),
      nationalCode: z.string().optional(),
      validCardNumber: z.string().optional(),
    }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://pay.ir/pg/send',
      verify: 'https://pay.ir/pg/verify',
      payment: 'https://pay.ir/pg/',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, description, mobile, nationalCode, validCardNumber } = options;
    const { apiKey, links, sandbox } = ctx;

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(links.request, {
      api: getApiKey(apiKey, sandbox ?? false),
      amount,
      redirect: callbackUrl,
      description,
      mobile,
      nationalCode,
      validCardNumber,
    });

    const { status } = response.data;

    if (status.toString() !== '1') {
      throw new RequestException(API.errors[status.toString()]);
    }

    response.data = response.data as API.RequestPaymentRes_Success;

    return {
      method: 'GET',
      referenceId: response.data.token,
      url: links.payment + response.data.token,
    };
  },
  verify: async ({ ctx, params }) => {
    const { status, token } = params;
    const { apiKey, sandbox, links } = ctx;

    if (status.toString() !== '1') {
      throw new PaymentException(API.errors[status.toString()]);
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(links.verify, {
      api: getApiKey(apiKey, sandbox ?? false),
      token,
    });

    const verifyStatus = response.data.status;

    if (verifyStatus.toString() !== '1') {
      throw new VerificationException(API.errors[verifyStatus.toString()]);
    }

    response.data = response.data as API.VerifyPaymentRes_Success;

    return {
      raw: response.data,
      transactionId: response.data.transId,
      cardPan: response.data.cardNumber,
    };
  },
});

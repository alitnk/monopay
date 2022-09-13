import axios from 'axios';
import { z } from 'zod';
import { generateUuid } from '../../utils/generateUuid';

import { defineDriver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export const createNextpayDriver = defineDriver({
  schema: {
    config: z.object({
      apiKey: z.string().optional(),
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
    }),
    request: z.object({
      mobile: z.string().optional(),
      customFields: z.record(z.string()).optional(),
    }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://nextpay.org/nx/gateway/token',
      verify: 'https://nextpay.org/nx/gateway/verify',
      payment: 'https://nextpay.org/nx/gateway/payment/',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, mobile, customFields } = options;
    const { links, apiKey } = ctx;

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(links.request, {
      api_key: apiKey,
      amount: amount * 10,
      callback_uri: callbackUrl,
      customer_phone: mobile ? +mobile : undefined,
      order_id: generateUuid(),
      custom_json_fields: customFields,
    });

    const { code, trans_id } = response.data;

    if (code.toString() !== '0') {
      throw new RequestException(API.errors[code.toString()]);
    }

    return {
      method: 'GET',
      referenceId: trans_id,
      url: links.payment + trans_id,
    };
  },
  verify: async ({ ctx, params }) => {
    const { amount, trans_id } = params;
    const { apiKey, links } = ctx;

    if (!trans_id) {
      throw new PaymentException('تراکنش توسط کاربر لغو شد.');
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(links.verify, {
      amount: +amount * 10,
      trans_id,
      api_key: apiKey,
    });

    const { Shaparak_Ref_Id, code, card_holder } = response.data;

    if (code.toString() !== '0') {
      throw new VerificationException(API.errors[code.toString()]);
    }

    return {
      raw: response.data,
      transactionId: Shaparak_Ref_Id,
      cardPan: card_holder,
    };
  },
});

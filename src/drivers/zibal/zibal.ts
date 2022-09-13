import axios from 'axios';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

const getMerchantId = (merchantId: string, sandbox: boolean) => (sandbox ? 'zibal' : merchantId);

export const createZibalDriver = defineDriver({
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
    request: z.object({
      mobile: z.string().optional(),
      orderId: z.string().optional(),
      allowedCards: z.array(z.string()).optional(),
      linkToPay: z.boolean().optional(),
      sms: z.boolean().optional(),
      percentMode: z.union([z.literal(0), z.literal(1)]).optional(),
      feeMode: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
      multiplexingInfos: z.array(API.multiplexingObjectSchema).optional(),
    }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://gateway.zibal.ir/v1/request',
      verify: 'https://gateway.zibal.ir/v1/verify',
      payment: 'https://gateway.zibal.ir/start/',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, ...otherOptions } = options;
    const { merchantId, sandbox, links } = ctx;

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(links.request, {
      merchant: getMerchantId(merchantId, sandbox ?? false),
      amount: amount,
      ...otherOptions,
    });
    const { result, trackId } = response.data;

    if (result !== 100) {
      throw new RequestException(API.purchaseErrors[result.toString()]);
    }

    return {
      method: 'GET',
      referenceId: trackId,
      url: links.payment + trackId,
    };
  },
  verify: async ({ ctx, params }) => {
    const { status, success, trackId } = params;
    const { merchantId, sandbox, links } = ctx;

    if (success.toString() === '0') {
      throw new PaymentException(API.callbackErrors[status]);
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(links.verify, {
      merchant: getMerchantId(merchantId, sandbox ?? false),
      trackId: +trackId,
    });

    const { result } = response.data;

    if (result !== 100) {
      throw new VerificationException(API.verifyErrors[result.toString()]);
    }

    return {
      raw: response.data,
      transactionId: response.data.refNumber,
      cardPan: response.data.cardNumber,
    };
  },
});
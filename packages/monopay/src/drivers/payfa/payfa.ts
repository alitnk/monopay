import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

const getHeaders = (apiKey: string) => {
  return {
    'X-API-Key': apiKey,
  };
};

export const createPayfaDriver = defineDriver({
  schema: {
    config: z.object({
      apiKey: z.string(),
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
    }),
    request: z.object({
      mobileNumber: z.string(),
      invoiceId: z.string(),
      cardNumber: z.string(),
    }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://payment.payfa.com/v2/api/Transaction/Request',
      verify: 'https://payment.payfa.com/v2/api/Transaction/Verify/',
      payment: 'https://payment.payfa.ir/v2/api/Transaction/Pay/',
    },
  },
  request: async ({ options, ctx }) => {
    const { amount, callbackUrl, description, mobileNumber, cardNumber, invoiceId } = options;

    let response;

    try {
      response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(
        ctx.links.request,
        {
          amount,
          callbackUrl,
          description,
          mobileNumber,
          cardNumber,
          invoiceId,
        },
        {
          headers: getHeaders(ctx.apiKey),
        },
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new RequestException(error.response?.data.message);
      }
    }

    if (!response?.data) {
      throw new RequestException();
    }
    if ('errorCode' in response.data) {
      throw new RequestException(response.data.message || '');
    }

    const { paymentId } = response.data;

    return {
      method: 'GET',
      referenceId: paymentId,
      url: ctx.links.payment + paymentId,
      params: {},
    };
  },
  verify: async ({ options, ctx, params }) => {
    const { paymentId, isSucceed } = params;

    let response;
    try {
      response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
        ctx.links.verify + paymentId,
        {},
        { headers: getHeaders(ctx.apiKey) },
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new VerificationException(error.response?.data.message);
      }
    }

    if (!response?.data) {
      throw new VerificationException();
    }

    if ('errorCode' in response.data) {
      throw new VerificationException(response.data.message || '');
    }

    const { transactionId, cardNo } = response.data;

    return {
      raw: response.data,
      transactionId: transactionId,
      cardPan: cardNo,
    };
  },
});
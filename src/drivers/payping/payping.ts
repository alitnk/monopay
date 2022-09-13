import axios from 'axios';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

const statusToMessage = (status = 500) => {
  const map: Record<string, string> = {
    '400': 'مشکلی در اطلاعات ارسالی وجود دارد.',
    '401': 'شما به این آیتم دسترسی ندارید.',
    '403': 'دسترسی شما غیر مجاز است.',
    '404': 'یافت نشد.',
    '500': 'مشکلی از طرف درگاه پرداخت رخ داده.',
    '502': 'سرور پراکسی با خطا مواجه شده است.',
    '503': 'سرور درگاه پرداخت در حال حاضر پاسخ‌گو نیست.',
  };

  return map[status.toString()] ?? map['500'];
};

export const createPaypingDriver = defineDriver({
  schema: {
    config: z.object({
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
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
      request: 'https://api.payping.ir/v2/pay',
      verify: 'https://api.payping.ir/v2/pay/verify',
      payment: 'https://api.payping.ir/v2/pay/gotoipg/',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, mobile, email, name, description } = options;
    const { apiKey, links } = ctx;
    let response;

    try {
      response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(
        links.request,
        {
          amount: amount * 10,
          returnUrl: callbackUrl,
          description,
          payerIdentity: mobile || email,
          payerName: name,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );
    } catch (error) {
      throw new RequestException(statusToMessage((error as any).response.status));
    }

    const { code } = response.data;

    return {
      method: 'GET',
      referenceId: code,
      url: links.payment + code,
    };
  },
  verify: async ({ ctx, options, params }) => {
    const { code, refid } = params;
    const { amount } = options;
    const { apiKey, links } = ctx;
    let response;

    try {
      response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
        links.verify,
        {
          amount: amount * 10,
          refId: code,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );
    } catch (error) {
      throw new VerificationException(statusToMessage((error as any).response.status));
    }

    const { cardNumber } = response.data;

    return {
      raw: response.data,
      transactionId: refid,
      cardPan: cardNumber,
    };
  },
});

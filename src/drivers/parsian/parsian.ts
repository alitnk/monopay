import * as soap from 'soap';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { GatewayFailureError, UserError } from '../../exceptions';
import { generateId } from '../../utils/generateId';
import * as API from './api';

export const createParsianDriver = defineDriver({
  schema: {
    config: z.object({
      merchantId: z.string(),
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
    }),
    request: z.object({}),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://pec.shaparak.ir/NewIPGServices/Sale/SaleService.asmx?wsdl',
      verify: 'https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx?wsdl',
      payment: 'https://pec.shaparak.ir/NewIPG/',
    },
  },
  request: async ({ options, ctx }) => {
    const { amount, callbackUrl, description } = options;
    const { merchantId, links } = ctx;
    const client = await soap.createClientAsync(links.request);

    const requestFields: API.RequestPaymentReq = {
      Amount: amount,
      CallBackUrl: callbackUrl,
      AdditionalData: description || '',
      LoginAccount: merchantId,
      OrderId: generateId(),
    };

    const response: API.RequestPaymentRes = client.SalePaymentRequest(requestFields);

    const { Status, Token } = response;
    if (Status.toString() !== '0' || typeof Token === 'undefined') {
      throw new GatewayFailureError('خطایی در درخواست پرداخت به‌وجود آمد');
    }

    return {
      method: 'GET',
      referenceId: Token,
      url: links.payment,
      params: { Token },
    };
  },
  verify: async ({ ctx, params }) => {
    const { Token, status } = params;
    const { merchantId, links } = ctx;

    if (status.toString() !== '0') {
      throw new UserError('تراکنش توسط کاربر لغو شد.');
    }

    const soapClient = await soap.createClientAsync(links.verify);

    const requestFields: API.VerifyPaymentReq = {
      LoginAccount: merchantId,
      Token: +Token,
    };

    // 1. Verify
    const verifyResponse: API.VerifyPaymentRes = soapClient.ConfirmPayment(requestFields);

    const { CardNumberMasked, RRN, Status } = verifyResponse;
    if (!(Status.toString() === '0' && RRN > 0)) {
      const reversalRequestFields: API.ReversalPaymentReq = requestFields;
      const reversalResponse: API.ReversalPaymentRes = soapClient.ReversalRequest(reversalRequestFields);
      if (reversalResponse.Status !== '0') {
        throw new GatewayFailureError('خطایی در تایید پرداخت به‌وجود آمد و مبلغ بازگشته نشد.');
      }
      throw new GatewayFailureError('خطایی در تایید پرداخت به‌وجود آمد');
    }

    return {
      transactionId: RRN,
      cardPan: CardNumberMasked,
      raw: verifyResponse,
    };
  },
});

export type ParsianDriver = ReturnType<typeof createParsianDriver>;

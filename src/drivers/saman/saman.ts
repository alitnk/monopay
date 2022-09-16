import axios from 'axios';
import * as soap from 'soap';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { BadConfigError, PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

const throwOnIPGBadConfigError = (errorCode: string) => {
  if (API.IPGConfigErrors.includes(errorCode))
    throw new BadConfigError(API.purchaseErrors[errorCode] ?? API.callbackErrors[errorCode], true);
};

export const createSamanDriver = defineDriver({
  schema: {
    config: z.object({
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
      merchantId: z.string(),
    }),
    request: z.object({
      mobile: z.string().optional(),
      wage: z.number().optional(),
    }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://sep.shaparak.ir/Payments/InitPayment.asmx?WSDL',
      verify: 'https://sep.shaparak.ir/payments/referencepayment.asmx?WSDL',
      payment: 'https://sep.shaparak.ir/payment.aspx',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, mobile, wage } = options;
    const { merchantId, links } = ctx;
    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(links.request, {
      Amount: amount,
      RedirectURL: callbackUrl,
      CellNumber: mobile,
      TerminalId: merchantId,
      Action: 'token',
      Wage: wage,
    });

    if (response.data.status !== 1 && response.data.errorCode !== undefined) {
      const errorCode = response.data.errorCode.toString();
      throwOnIPGBadConfigError(errorCode);
      throw new RequestException(API.purchaseErrors[errorCode]);
    }

    if (!response.data.token) {
      throw new RequestException();
    }

    return {
      method: 'POST',
      referenceId: response.data.token,
      url: links.payment,
      params: {
        Token: response.data.token,
        GetMethod: true,
      },
    };
  },
  verify: async ({ ctx, params }) => {
    const { RefNum: referenceId, TraceNo: transactionId, Status: status } = params;
    const { merchantId, links } = ctx;
    if (!referenceId) {
      const resCode = status.toString();
      throwOnIPGBadConfigError(resCode);
      throw new PaymentException(API.purchaseErrors[resCode]);
    }

    const soapClient = await soap.createClientAsync(links.verify);

    const responseStatus = +(await soapClient.verifyTransaction(referenceId, merchantId));

    if (responseStatus < 0) {
      throwOnIPGBadConfigError(responseStatus.toString());
      throw new VerificationException(API.purchaseErrors[responseStatus]);
    }

    return {
      transactionId: +transactionId,
      cardPan: params.SecurePan,
      raw: params,
    };
  },
});

export type SamanDriver = ReturnType<typeof createSamanDriver>;

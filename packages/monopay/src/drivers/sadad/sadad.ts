import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { BadConfigError, GatewayFailureError } from '../../exceptions';
import { generateId } from '../../utils/generateId';
import * as API from './api';

const signData = (message: string, key: string): string => {
  try {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  } catch (err) {
    throw new BadConfigError({ message: 'The signing process has failed. Error: ' + err, isIPGError: false });
  }
};

const throwError = (errorCode: string) => {
  const message = API.requestErrors[errorCode] ?? API.verifyErrors[errorCode];
  if (API.IPGConfigErrors.includes(errorCode)) throw new BadConfigError({ message, isIPGError: true, code: errorCode });
  throw new GatewayFailureError({ message, code: errorCode });
};

export const createSadadDriver = defineDriver({
  schema: {
    config: z.object({
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
      merchantId: z.string(),
      terminalId: z.string(),
      terminalKey: z.string(),
    }),
    request: z.object({
      mobile: z.string().optional(),
      multiplexingData: API.multiplexingObjectSchema.optional(),
      appName: z.string().optional(),
    }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://sadad.shaparak.ir/api/v0/Request/PaymentRequest',
      verify: 'https://sadad.shaparak.ir/api/v0/Advice/Verify',
      payment: 'https://sadad.shaparak.ir/Purchase',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, mobile, multiplexingData, appName } = options;
    const { merchantId, terminalId, terminalKey, links } = ctx;

    const orderId = generateId();
    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(links.request, {
      Amount: amount,
      LocalDateTime: new Date().toISOString(),
      MerchantId: merchantId,
      TerminalId: terminalId,
      OrderId: orderId,
      ReturnUrl: callbackUrl,
      ApplicationName: appName,
      SignData: signData(`${terminalId};${orderId};${amount}`, terminalKey),
      MultiplexingData: multiplexingData,
      UserId: mobile ? +mobile : undefined,
    });

    if (response.data.ResCode !== 0) {
      throwError(response.data.ResCode.toString());
    }

    return {
      method: 'GET',
      referenceId: response.data.Token,
      url: links.payment,
      params: {
        Token: response.data.Token,
      },
    };
  },
  verify: async ({ ctx, params }) => {
    const { HashedCardNo, ResCode, Token } = params;
    const { terminalKey, links } = ctx;

    if (ResCode !== 0) {
      throwError(ResCode.toString());
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(links.verify, {
      SignData: signData(Token, terminalKey),
      Token,
    });

    const { ResCode: verificationResCode, SystemTraceNo } = response.data;

    if (verificationResCode !== 0) {
      throwError(verificationResCode.toString());
    }

    return {
      transactionId: SystemTraceNo,
      cardPan: HashedCardNo,
      raw: params,
    };
  },
});

export type SadadDriver = ReturnType<typeof createSadadDriver>;

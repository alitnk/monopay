import * as soap from 'soap';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { BadConfigError, PaymentException, RequestException, UserError, VerificationException } from '../../exceptions';
import { generateId } from '../../utils/generateId';
import * as API from './api';

/**
 * YYYYMMDD
 */
const dateFormat = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  return yyyy.toString() + mm.toString() + dd.toString();
};

/**
 * HHMMSS
 */
const timeFormat = (date = new Date()) => {
  const hh = date.getHours();
  const mm = date.getMonth();
  const ss = date.getSeconds();
  return hh.toString() + mm.toString() + ss.toString();
};

const throwError = (errorCode: string) => {
  if (API.IPGConfigErrors.includes(errorCode)) throw new BadConfigError(API.errors[errorCode], true);
  if (API.IPGUserErrors.includes(errorCode)) throw new UserError(API.errors[errorCode]);
};

export const createBehpardakhtDriver = defineDriver({
  schema: {
    config: z.object({
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
      terminalId: z.number(),
      username: z.string(),
      password: z.string(),
    }),
    request: z.object({
      payerId: z.number().optional(),
    }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl',
      verify: 'https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl',
      payment: 'https://bpm.shaparak.ir/pgwchannel/startpay.mellat',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, description, payerId } = options;
    const { terminalId, username, password, links } = ctx;
    const client = await soap.createClientAsync(links.request);

    const requestFields: API.RequestPaymentReq = {
      terminalId,
      userName: username,
      userPassword: password,
      amount,
      callBackUrl: callbackUrl,
      orderId: generateId(),
      localDate: dateFormat(),
      localTime: timeFormat(),
      payerId: payerId || 0,
      additionalData: description || '',
    };

    const response: API.RequestPaymentRes = client.bpPayRequest(requestFields);
    const splittedResponse = response.split(', ');
    const ResCode = splittedResponse[0];
    const RefId = splittedResponse[1];

    if (ResCode.toString() !== '0') {
      throwError(ResCode);
      throw new RequestException(API.errors[ResCode]);
    }

    return {
      method: 'POST',
      referenceId: RefId,
      url: links.payment,
      params: {
        RefId,
      },
    };
  },
  verify: async ({ ctx, params }) => {
    const { RefId, ResCode, saleOrderId, SaleReferenceId, CardHolderPan } = params;
    const { terminalId, username, password, links } = ctx;

    if (ResCode !== '0') {
      throwError(ResCode);
      throw new PaymentException(API.errors[ResCode]);
    }

    const soapClient = await soap.createClientAsync(links.verify);

    const requestFields: API.VerifyPaymentReq = {
      terminalId,
      userName: username,
      userPassword: password,
      orderId: saleOrderId,
      saleOrderId: saleOrderId,
      saleReferenceId: SaleReferenceId,
    };

    // 1. Verify
    const verifyResponse: API.VerifyPaymentRes = soapClient.bpVerifyRequest(requestFields);

    if (verifyResponse.toString() !== '0') {
      if (verifyResponse.toString() !== '43') {
        soapClient.bpReversalRequest(requestFields);
      }
      throwError(ResCode);
      throw new VerificationException(API.errors[verifyResponse]);
    }

    // 2. Settle
    const settleResponse = soapClient.bpSettleRequest(requestFields);
    if (settleResponse.toString() !== '0') {
      if (settleResponse.toString() !== '45' && settleResponse.toString() !== '48') {
        soapClient.bpReversalRequest(requestFields);
      }
      throwError(ResCode);
      throw new VerificationException(API.errors[verifyResponse]);
    }

    return {
      transactionId: RefId,
      cardPan: CardHolderPan,
      raw: params,
    };
  },
});

export type BehpardakhtDriver = ReturnType<typeof createBehpardakhtDriver>;

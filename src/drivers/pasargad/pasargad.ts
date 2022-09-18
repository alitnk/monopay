import RSAXML from '@keivan.sf/rsa-xml';
import axios from 'axios';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { z } from 'zod';
import { defineDriver } from '../../driver';
import { BadConfigError, GatewayFailureError } from '../../exceptions';
import * as API from './api';

const getCurrentTimestamp = (): string => {
  const currentDateISO = new Date().toISOString();
  return currentDateISO.replace(/-/g, '/').replace('T', ' ').replace('Z', '').split('.')[0];
};

const signData = async (data: unknown, privateKeyXMLFile: string): Promise<string> => {
  try {
    const sign = crypto.createSign('SHA1');
    sign.write(JSON.stringify(data));
    sign.end();
    const pemKey = await convertXmlToPemKey(privateKeyXMLFile);
    const signedData = sign.sign(Buffer.from(pemKey), 'base64');
    return signedData;
  } catch (err) {
    throw new BadConfigError({ message: 'The signing process has failed. Error: ' + err, isIPGError: false });
  }
};

const convertXmlToPemKey = async (xmlFilePath: string): Promise<string> => {
  const xmlKey = (await fs.readFile(xmlFilePath)).toString();
  const rsa = RSAXML();
  return rsa.exportPemKey(xmlKey);
};

export const errorMessage = 'عملیات با خطا مواجه شد';

export const createPasargadDriver = defineDriver({
  schema: {
    config: z.object({
      /**
       * Your **RSA** Private key file path.
       * File must be in `XML` format
       */
      privateKeyXMLFile: z.string(),
      merchantId: z.string(),
      terminalId: z.string(),
      links: z.object({
        request: z.string(),
        verify: z.string(),
        payment: z.string(),
      }),
    }),
    request: z.object({
      invoiceNumber: z.string(),
      invoiceDate: z.string(),
      mobile: z.string().optional(),
      email: z.string().optional(),
    }),
    verify: z.object({}),
  },
  defaultConfig: {
    links: {
      request: 'https://pep.shaparak.ir/Api/v1/Payment/GetToken',
      verify: 'https://pep.shaparak.ir/Api/v1/Payment/VerifyPayment',
      payment: 'https://pep.shaparak.ir/payment.aspx',
    },
  },
  request: async ({ ctx, options }) => {
    const { amount, callbackUrl, invoiceDate, invoiceNumber, email, mobile } = options;
    const { merchantId, terminalId, privateKeyXMLFile, links } = ctx;

    const data: API.RequestPaymentReq = {
      MerchantCode: merchantId,
      TerminalCode: terminalId,
      Action: 1003,
      Amount: amount,
      InvoiceDate: invoiceDate,
      InvoiceNumber: invoiceNumber,
      RedirectAddress: callbackUrl,
      Timestamp: getCurrentTimestamp(),
    };
    const optionalParams = Object.entries({ Email: email, Mobile: mobile });
    for (const param of optionalParams) if (param[1]) data[param[0] as 'Email' | 'Mobile'] = param[1];
    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(links.request, data, {
      headers: {
        Sign: await signData(data, privateKeyXMLFile),
      },
    });

    if (!response.data?.IsSuccess) {
      throw new GatewayFailureError({ message: errorMessage });
    }
    return {
      method: 'GET',
      referenceId: response.data.Token,
      url: links.payment,
      params: {
        n: response.data.Token,
      },
    };
  },
  verify: async ({ ctx, options, params }) => {
    const { amount } = options;
    const { iD, iN, tref } = params;
    const { terminalId, merchantId, privateKeyXMLFile, links } = ctx;
    const data: API.VerifyPaymentReq = {
      Amount: amount,
      InvoiceDate: iD,
      InvoiceNumber: iN,
      Timestamp: getCurrentTimestamp(),
      TerminalCode: terminalId,
      MerchantCode: merchantId,
    };
    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(links.verify, data, {
      headers: {
        Sign: await signData(data, privateKeyXMLFile),
      },
    });
    if (!response.data?.IsSuccess) throw new GatewayFailureError({ message: errorMessage });
    return {
      raw: response.data,
      transactionId: tref,
      cardPan: response.data.MaskedCardNumber,
    };
  },
});

export type PasargadDriver = ReturnType<typeof createPasargadDriver>;

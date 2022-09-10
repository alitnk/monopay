import { z } from 'zod';
import { baseConfigSchema, BaseReceipt, baseRequestSchema, baseVerifySchema, LinksObject } from '../../types';

/*
 * PayPing's API
 * Currency: IRT
 */

export const links: LinksObject = {
  default: {
    REQUEST: 'https://api.payping.ir/v2/pay',
    VERIFICATION: 'https://api.payping.ir/v2/pay/verify',
    PAYMENT: 'https://api.payping.ir/v2/pay/gotoipg/',
  },
};

export interface RequestPaymentReq {
  /**
   * integer <int32> [ 100 .. 50000000 ]
   */
  amount: number;

  /**
   *شماره موبایل یا ایمیل پرداخت کننده
   */
  payerIdentity?: string;
  /**
   *نام پرداخت کننده
   */
  payerName?: string;
  /**
   *توضیحات
   */
  description?: string;
  /**
   *آدرس صفحه برگشت
   */
  returnUrl: string;

  /**
   *کد ارسالی توسط کاربر
   */
  clientRefId?: string;
}

export interface RequestPaymentRes {
  /**
   * کد پرداخت
   */
  code: string;
}

export interface CallbackParams {
  code: string;
  refid: string;
  clientrefid: string;
  cardnumber: string;
  cardhashpan: string;
}

export interface VerifyPaymentReq {
  /**
   * شماره فاکتور
   */
  refId: string;

  /**
   * مبلغ تراکنش
   * integer <int32> [ 100 .. 50000000 ]
   */
  amount: number;
}

export interface VerifyPaymentRes {
  amount: number;
  cardNumber: string;
  cardHashPan: string;
}

/*
 * Package's API
 */

export const configSchema = baseConfigSchema.extend({
  apiKey: z.string(),
});

export type Config = z.infer<typeof configSchema>;

export const requestSchema = baseRequestSchema.extend({
  mobile: z.string().optional(),
  email: z.string().optional(),
  name: z.string().optional(),
});

export type RequestOptions = z.infer<typeof requestSchema>;

export const verifySchema = baseVerifySchema;

export type VerifyOptions = z.infer<typeof verifySchema>;

export type Receipt = BaseReceipt<VerifyPaymentRes>;

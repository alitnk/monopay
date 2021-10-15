import * as t from 'io-ts';
import { BaseReceipt, LinksObject, tBaseRequestOptions, tBaseVerifyOptions } from '../../types';

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

export const tConfig = t.intersection([
  t.partial({}),
  t.interface({
    apiKey: t.string,
  }),
]);

export type Config = t.TypeOf<typeof tConfig>;

export const tRequestOptions = t.intersection([
  t.partial({
    mobile: t.string,
    email: t.string,
    name: t.string,
  }),
  tBaseRequestOptions,
]);

export type RequestOptions = t.TypeOf<typeof tRequestOptions>;

export const tVerifyOptions = t.intersection([t.interface({}), tBaseVerifyOptions]);

export type VerifyOptions = t.TypeOf<typeof tVerifyOptions>;

export type Receipt = BaseReceipt<VerifyPaymentRes>;

import * as t from 'io-ts';
import { BaseReceipt, LinksObject, tBaseRequestOptions, tBaseVerifyOptions } from '../../types';

export const links: LinksObject = {
  default: {
    REQUEST: 'https://pep.shaparak.ir/Api/v1/Payment/GetToken',
    VERIFICATION: 'https://pep.shaparak.ir/Api/v1/Payment/VerifyPayment',
    PAYMENT: 'https://pep.shaparak.ir/payment.aspx',
  },
};

export interface CallbackParams {
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  TransactionReferenceID: string;
}

export interface VerifyPaymentReq {
  /**
   * شماره فاکتور که برای هر خرید باید متفاوت باشد
   */
  InvoiceNumber: string;
  /**
   * تاریخ فاکتور خرید به فرمت دلخواه.
   * لازم به ذکر است که تاریخ باید به گونه ای باشد که با شماره فاکتور یک شناسه اختصاصی ساخته
   * تا همیشه بتوان از آن به عنوان شناسه یکتای خرید استفاده کرد
   */
  InvoiceDate: string;
  /**
   * شماره شناسایی ترمینال
   */
  TerminalCode: string;
  /**
   * شماره شناسایی پذیرنده
   */
  MerchantCode: string;
  /**
   * مبلغ فاکتور
   */
  Amount: number;
  /**
   * زمان ارسال درخواست
   * @description فرمت: `YYYY/MM/DD HH:MM:SS`
   * @example 2019/01/27 17:57:06
   */
  Timestamp: string;
}

export interface VerifyPaymentRes {
  /**
   * نشان دهنده موفقیت آمیز بودن و یا شکست عملیات
   * @example true
   */
  IsSuccess: boolean;
  /**
   * پیام بانک
   * @example عملیات با موفقیت انجام شد
   */
  Message: string;
  /**
   * شمارت کارت ماسک شده
   * @example 5022-29**-****-2328
   */
  MaskedCardNumber: string;
  /**
   * شماره کارت هش شده
   * @example 2DDB1E270C5986...
   */
  HashedCardNumber: string;
  /**
   * کد پیگیری شاپرک
   * @example 100200300400500
   */
  ShaparakRefNumber: string;
}

export const tRequestOptions = t.intersection([
  t.type({
    invoiceNumber: t.string,
    invoiceDate: t.string,
  }),
  t.partial({
    mobile: t.string,
    email: t.string,
    name: t.string,
    PIDN: t.string,
  }),
  tBaseRequestOptions,
]);

export type RequestOptions = t.TypeOf<typeof tRequestOptions>;

export const tConfig = t.interface({
  certificate_file: t.string,
  merchantId: t.string,
  terminalId: t.string,
});

export type Config = t.TypeOf<typeof tConfig>;

export const tVerifyOptions = t.intersection([t.interface({}), tBaseVerifyOptions]);

export type VerifyOptions = t.TypeOf<typeof tVerifyOptions>;

export type Receipt = BaseReceipt<VerifyPaymentRes>;

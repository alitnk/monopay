import * as t from 'io-ts';
import { BaseReceipt, LinksObject, tBaseRequestOptions, tBaseVerifyOptions } from '../../types';

/*
 * Parsian's API
 * Currency: IRR
 *
 * Docs: https://miladworkshop.ir/blog/19-parsian-gateway-sample-code.html
 */

export const links: LinksObject = {
  default: {
    REQUEST: 'https://pec.shaparak.ir/NewIPGServices/Sale/SaleService.asmx?wsdl',
    VERIFICATION: 'https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx?wsdl',
    PAYMENT: '‫‪https://pec.shaparak.ir/NewIPG/',
  },
};

/**
 * Request of `SalePaymentRequest`
 */
export interface RequestPaymentReq {
  /**
   * فروشنده پین
   */
  LoginAccount: string;

  /**
   * پرداخت مبلغ
   */
  Amount: number;

  /**
   * شماره سفارش - بایت یکتا باشد و یکتایی آن از جانب بانک نیز کنترل شود
   */
  OrderId: number;

  /**
   * صفحه بازگشت مشتری به وب سایت پذیرنده، ‌پس از انجام عمل پرداخت.
   */
  CallBackUrl: string;

  /**
   * داده اضافی
   */
  AdditionalData: string;
}

/**
 * Response of `SalePaymentRequest`
 */
export interface RequestPaymentRes {
  /**
   * شماره درخواست در دروازه پرداخت که یک شماره تصادفی و یکتا برای تمامی عملیات تراکنش می باشد و فروشگاه ملزم به ثبت و نگهداری این کد است
   */
  Token?: number | string;

  /**
   * کد وضعیت در عملیات موفق صفر است
   */
  Status: number;
}

/**
 * NOTE: this gets sent on POST method
 */
export interface CallbackParams {
  Token: number | string;
  status: number | string;
  OrderId: number | string;
  TerminalNo: number | string;
  RRN: number | string;
  HashCardNumber: string;
  Amount: number;
}

/**
 * Request of `ConfirmPayment`
 */
export interface VerifyPaymentReq {
  /**
   * پذیرنده شناسایی کد
   */
  LoginAccount: string;

  /**
   * پرداخت دروازه در درخواست شماره
   */
  Token: number | string;
}

/**
 * Response of `ConfirmPayment`
 */
export interface VerifyPaymentRes {
  /**
   * کد وضعیت عملیات که در صورت موفقیت صفر است
   */
  Status: number | string;

  /**
   * شماره مکرجع
   */
  RRN: number;

  /**
   * شماره کارت کاربر به صورت ماسک شده
   */
  CardNumberMasked: string;

  /**
   * شماره درخواست تراکنش دروازه پرداخت پارسیان
   */
  Token: number | string;
}

/**
 * Request of `ReversalRequest`
 */
export type ReversalPaymentReq = VerifyPaymentReq;

/**
 * Response of `ReversalRequest`
 */
export interface ReversalPaymentRes {
  /**
   * کد وضعیت عملیات که در صورت موفقیت صفر است
   */
  Status: string;

  /**
   * شماره درخواست تراکنش دروازه پرداخت پارسیان
   */
  Token: number | string;
}

// export const errors: ErrorList = {
//   // UnkownError
//   '-32768': 'خطای ناشناخته رخ داده است',
//   // Payment RequestIsNotEligibleToReversal
//   '-1552': 'برگشت تراکنش مجاز نمی باشد',
//   // Payment RequestsAlreadIsReversed
//   '-1551': 'برگشت تراکت قبلا انجام شده است',
//   // PaymentequestStatusIsNotReversalable
//   '-1550': 'برگشت تراکش در وضعیت جاری امکان پذیر نمی باشد',
//   // MaxAllowedTimeToReversalHasExceeded
//   '-1549': 'زمان مجاز برای در خواست برگشت تراکنش به اتمام رسیده است',
//   // BillPaymentRequestServiceFailed
//   '-1548': 'فراخوانی سرویس درخواست پرداخت قبض ناموفق بود ',
//   // InvalidConfigmRequestService
//   '-1540': 'تایید تراکنش ناموفق می باشد',
//   //TopupChargeServiceTopupChargeRequestFailed
//   '-1536': 'فراخوانی سرویس درخواست شارژ تاپ آپ الاموفق بود',
//   // PaymentIsAlreadyConfirmed
//   '-1533': 'تراکنش قلا تایید شده است',
//   // MerchantHasConfirmedPaymentRequest
//   '-1532': 'تراکنش از سوی پذیرنده تایید شد',
//   // CannotConfirmNonSuccessfulPayment
//   '-1531': 'تایید تراکنش ناموفق امکان پذیر نمی باشد',
//   // there's like 6 more pages of these errors
//   // TODO import the errors?
// };

/*
 * Package's API
 */

export const tConfig = t.interface({
  merchantId: t.string,
});

export type Config = t.TypeOf<typeof tConfig>;

export const tRequestOptions = t.intersection([t.partial({}), tBaseRequestOptions]);

export type RequestOptions = t.TypeOf<typeof tRequestOptions>;

export const tVerifyOptions = t.intersection([t.interface({}), tBaseVerifyOptions]);

export type VerifyOptions = t.TypeOf<typeof tVerifyOptions>;

export type Receipt = BaseReceipt<VerifyPaymentRes>;

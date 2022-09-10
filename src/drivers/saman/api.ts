import { z } from 'zod';
import {
  baseConfigSchema,
  BaseReceipt,
  baseRequestSchema,
  baseVerifySchema,
  ErrorList,
  LinksObject,
} from '../../types';

/*
 * Saman's API
 * Currency: IRR
 */

export const links: LinksObject = {
  default: {
    REQUEST: 'https://sep.shaparak.ir/Payments/InitPayment.asmx?WSDL',
    VERIFICATION: 'https://sep.shaparak.ir/payments/referencepayment.asmx?WSDL',
    PAYMENT: 'https://sep.shaparak.ir/payment.aspx',
  },
};

export interface RequestPaymentReq {
  Amount: number;
  TerminalId: string;
  RedirectURL: string;
  Action?: 'token';
  Wage?: number;
  AffectiveAmount?: number;
  ResNum?: string;
  CellNumber?: string;
}

export interface RequestPaymentRes {
  status: 1 | -1;
  errorCode?: number;
  errorDesc?: string;
  token?: string;
}

export interface CallbackParams {
  /**
   * شماره ترمینال
   */
  MID: string;
  /**
   * وضعیت تراکنش - حروف انگلیسی
   */
  State: string;
  /**
   * وضعیت تراکنش - مقدار عددی
   */
  Status: string;
  /**
   * شماره مرجع تراکنش
   */
  RRN: string;
  /**
   * رسید دیجیتالی خرید
   */
  RefNum: string;
  /**
   * شماره خرید
   */
  ResNum: string;
  /**
   * شماره ترمینال
   */
  TerminalId: string;
  /**
   * شماره رهگیری
   */
  TraceNo: string;
  /**
   *
   */
  Amount: string;
  /**
   *
   */
  Wage?: string;
  /**
   * شماره کارتی که تراکنش با آن انجام شده است
   */
  SecurePan: string;
}

export const purchaseErrors: ErrorList = {
  '-1': 'خطای در پردازش اطالعات ارسالی. )مشکل در یکی از ورودیها و ناموفق بودن فراخوانی متد برگشت تراکنش(',
  '-3': 'ورودیها حاوی کارکترهای غیرمجاز میباشند.',
  '-4': 'Failed Authentication Merchant (کلمه عبور یا کد فروشنده اشتباه است(',
  '-6': 'تراکنش قبال برگشت داده شده است.',
  '-7': 'رسید دیجیتالی تهی است.',
  '-8': 'طول ورودیها بیشتر از حد مجاز است.',
  '-9': 'وجود کارکترهای غیرمجاز در مبلغ برگشتی.',
  '-10': 'رسید دیجیتالی به صورت Base64 نیست )حاوی کارکترهای غیرمجاز است(.',
  '-11': 'طول ورودیها کمتر از حد مجاز است.',
  '-12': 'مبلغ برگشتی منفی است.',
  '-13': 'مبلغ برگشتی برای برگشت جزئی بیش از مبلغ برگشت نخوردهی رسید دیجیتالیاست.',
  '-14': 'چنین تراکنشی تعریف نشده است.',
  '-15': 'مبلغ برگشتی به صورت اعشاری داده شده است.',
  '-16': 'خطای داخلی سیستم',
  '-17': 'برگشت زدن جزیی تراکنش مجاز نمی باشد.',
  '-18': 'Address IP فروشنده نا معتبر است',
};

export const callbackErrors: ErrorList = {
  // CanceledByUser
  '1': 'کاربر انصراف داده است',
  // OK
  '2': 'پرداخت با موفقیت انجام شد',
  // Failed
  '3': 'پرداخت انجام نشد.',
  // SessionIsNull
  '4': 'کاربر در بازه زمانی تعیین شده پاسخی ارسال نکرده است.',
  // InvalidParameters
  '5': 'پارامترهای ارسالی نامعتبر است.',
  // MerchantIpAddressIsInvalid
  '8': 'آدرس سرور پذیرنده نامعتبر است )در پرداخت های بر پایه توکن(',
  // TokenNotFound
  '10': 'توکن ارسال شده یافت نشد.',
  // TokenRequired
  '11': 'با این شماره ترمینال فقط تراکنش های توکنی قابل پرداخت هستند.',
  // TerminalNotFound
  '12': 'شماره ترمینال ارسال شده یافت نشد.',
};

// export interface VerifyPaymentReq {}

export type VerifyPaymentRes = number;

/*
 * Package's API
 */

export const configSchema = baseConfigSchema.extend({
  merchantId: z.string(),
});

export type Config = z.infer<typeof configSchema>;

export const requestSchema = baseRequestSchema.extend({
  mobile: z.string().optional(),
  wage: z.number().optional(),
});

export type RequestOptions = z.infer<typeof requestSchema>;

export const verifySchema = baseVerifySchema;

export type VerifyOptions = z.infer<typeof verifySchema>;

export type Receipt = BaseReceipt<CallbackParams>;

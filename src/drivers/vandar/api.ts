import { z } from 'zod';
import { baseConfigSchema, BaseReceipt, baseRequestSchema, baseVerifySchema, LinksObject } from '../../types';

/*
 * Vandar's API
 * Currency: IRR
 */

export const links: LinksObject = {
  default: {
    REQUEST: 'https://ipg.vandar.io/api/v3/send',
    VERIFICATION: 'https://ipg.vandar.io/api/v3/verify',
    PAYMENT: 'https://ipg.vandar.io/v3/',
  },
};

export interface RequestPaymentReq {
  /**
   * این کلید بعد از ساخت درگاه پرداخت صادر می‌شود. برای دریافت این کلید به داشبورد وندار مراجعه کنید
   */
  api_key: string;
  /**
   *  مبلغ تراکنش به صورت ریالی و بزرگتر یا مساوی 1000
   */
  amount: number;
  /**
   * باید با آدرس درگاه پرداخت تایید شده در وندار بر روی یک دامنه باشد
   */
  callback_url: string;
  /**
   * شماره موبایل
   * (جهت نمایش کارت های خریدار به ایشان و نمایش درگاه موبایلی)
   */
  mobile_number?: string;
  /**
   * شماره فاکتور شما
   */
  factorNumber?: string;
  /**
   * توضیحات (حداکثر 255 کاراکتر)
   */
  description?: string;
  /**
   * شماره کارت معتبر
   *
   * (در صورت ارسال شماره کارت، کاربر فقط با همان شماره کارت قابلیت پرداخت خواهد داشت.)
   */
  valid_card_number?: string;
  /**
   * یک یادداشت که در داشبورد شما روی تراکنش نمایش داده می شود.
   */
  comment?: string;
}

export interface RequestPaymentRes {
  /**
   * مقدار 0 و 1 دارد که نشان دهنده موفقیت آمیز بودن درخواست است
   */
  status: 1 | 0;
  /**
   * یک رشته از حروف و اعداد است با طول متغییر، که توکن پرداخت است و باید سمت پذیرنده نگهداری شود.
   */
  token?: string;
  errors?: string[];
}

export interface CallbackParams {
  token: string;
  /**
   * TODO: Fail status is not documented!
   */
  payment_status: 'OK' | string;
}

export interface VerifyPaymentReq {
  /**
   * این کلید بعد از ساخت درگاه پرداخت صادر می‌شود. برای دریافت این کلید به داشبورد وندار مراجعه کنید
   */
  api_key: string;
  /**
   * همان توکن پرداختی که در مرحله یک دریافت کردید و در این مرحله از به صورت انتهای آدرس بازگشتی اضافه شده است.
   */
  token: string;
}

export interface VerifyPaymentRes {
  status: number;
  /**
   * مبلغ تراکنش که ممکن است با مبلغ تراکنشی که در مرحله اول ارسال کرده باشید متفاوت باشد.
   * اگر کارمزد تراکنش بر عهده پرداخت کننده باشد. مبلغ کارمزد هم به مبلغ تراکنش ارسالی از سمت شما اضافه شده است.
   */
  amount?: string;
  /**
   * مبلغی که بر اساس این تراکنش کیف پول شما بالا رفته است.
   */
  realAmount?: number;
  /**
   * کارمزد تراکنش
   */
  wage?: string;
  /**
   * شناسه یکتای پرداخت که برای پیگیری تراکنش از وندار مورد استفاده قرار می‌گیرد.
   */
  transId?: number;
  /**
   * شماره فاکتوری که شما در مرحله اول ارسال کردید.
   */
  factorNumber?: string;
  /**
   * شماره موبایل پرداخت کننده که در مرحله اول ارسال کردید.
   */
  mobile?: string;
  /**
   * توضیحاتی که شما در مرحله اول ارسال کردید.
   */
  description?: string;
  /**
   * ماسکه شده شماره کارت پرداخت کننده.
   */
  cardNumber?: string;
  /**
   * تاریخ انجام تراکنش.
   */
  paymentDate?: string;
  /**
   * هش شماره کارت که با الگوریتم SHA256 هش شده است.
   */
  cid?: null | string;
  /**
   * وضعیت تراکنش
   */
  message?: string;

  errors?: string[];
}

/*
 * Package's API
 */

export const tConfig = baseConfigSchema.extend({
  api_key: z.string(),
});

export type Config = z.infer<typeof tConfig>;

export const requestSchema = baseRequestSchema.extend({
  mobile_number: z.string().optional(),
  factorNumber: z.string().optional(),
  description: z.string().optional(),
  valid_card_number: z.string().optional(),
  comment: z.string().optional(),
});

export type RequestOptions = z.infer<typeof requestSchema>;

export const verifySchema = baseVerifySchema.extend({
  status: z.number().optional(),
  // amount: z.string().optional(),
  realAmount: z.number().optional(),
  wage: z.string().optional(),
  transId: z.number().optional(),
  factorNumber: z.string().optional(),
  mobile: z.string().optional(),
  description: z.string().optional(),
  cardNumber: z.string().optional(),
  paymentDate: z.string().optional(),
  cid: z.string().optional(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional(),
});

export type VerifyOptions = z.infer<typeof verifySchema>;

export type Receipt = BaseReceipt<CallbackParams>;

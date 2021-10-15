import * as t from 'io-ts';
import { BaseReceipt, ErrorList, LinksObject, tBaseRequestOptions, tBaseVerifyOptions } from '../../types';

/*
 * Behpardakht's API
 * Currency: IRR
 */

export const links: LinksObject = {
  default: {
    REQUEST: 'https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl',
    VERIFICATION: 'https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl',
    PAYMENT: 'https://bpm.shaparak.ir/pgwchannel/startpay.mellat',
  },
};

/**
 * Request of `bpPayRequest`
 */
export interface RequestPaymentReq {
  /**
   * شماره پایانه پذیرنده
   */
  terminalId: number;

  /**
   * نام کاربری پذیرنده
   */
  userName: string;

  /**
   * کلمه عبور پذیرنده
   */
  userPassword: string;

  /**
   * (پرداخت) ‫درخواست‬ ‫شماره
   * باید یکتا باشد‬
   */
  orderId: number;

  /**
   * ‫خريد‬ ‫مبلغ‬
   */
  amount: number;

  /**
   *  ‫‪YYYYMMDD‬‬ ‫درخواست‬ ‫تاريخ‬
   * @example "20091008‬"
   */
  localDate: string;

  /**
   * ‫‪HH:MM:SS‬‬ ‫درخواست‬ ‫ساعت‬
   * @example "‫‪102003"
   */
  localTime: string;

  /**
   * اطلاعات توضیحی که پذیرنده مایل به حفظ آن‌ها برای هر تراکنش می‌باشد
   */
  additionalData: string;

  /**
   * آدرس برگشت به سایت پذیرنده
   */
  callBackUrl: string;
  /**
   * ‫پرداخت‬ ‫شناسه‬ ‫كنند‬
   */
  payerId: number;
}

/**
 * Response of `bpPayRequest`, a string containing two parameters, separated with a `,`
 *
 * - First part is a ResCode
 * - Second part is a hashcode called RefId
 *
 * @example `‫‪0,‬‬ ‫‪AF82041a2Bf6989c7fF9‬‬`
 */
export type RequestPaymentRes = string;

/**
 * NOTE: this gets sent on POST method
 */
export interface CallbackParams {
  /**
   * کدر مرجع درخواست پرداخت که همراه با درخواست bpPayRequest تولید شده و به پذیرنده اختصاص یافته است
   */
  RefId: string;

  /**
   * وضعیت خرید با توجه به جدول شماره ۷
   */
  ResCode: string;

  /**
   * شماره درخواست پرداخت
   */
  saleOrderId: number;

  /**
   * کد مرجع تراکنش خرید که از سایت بانک به پذیرنده داده می‌شود
   */
  SaleReferenceId: number;

  /**
   * Either this one is not documented or my documentation is outdated.
   */
  CardHolderPan: string;
}

export interface VerifyPaymentReq {
  /**
   * شماره پایانه پذیرنده
   */
  terminalId: number;

  /**
   * نام کاربری پذیرنده
   */
  userName: string;

  /**
   * کلمه عبور پذیرنده
   */
  userPassword: string;

  /**
   * (پرداخت) ‫درخواست‬ ‫شماره
   * باید یکتا باشد‬
   */
  orderId: number;

  /**
   * شماره درخواست خرید
   *
   * همان orderId در مرحله قبل
   */
  saleOrderId: number;

  /**
   * کد مرجع تراکنش خرید
   */
  saleReferenceId: number;
}

/**
 * The response of `bpVerifyRequest`
 * 
 * a ResCode
 */
export type VerifyPaymentRes = string;

export const errors: ErrorList = {
  '‫‪11‬‬': '‫است‬ ‫نامعتبر‬ ‫كارت‬ ‫شماره‬',
  '‫‪12‬‬': '‫نيست‬ ‫كافي‬ ‫موجودي‬',
  '‫‪13‬‬': '‫است‬ ‫نادرست‬ ‫رمز‬',
  '‫‪14‬‬': '‫است‬ ‫مجاز‬ ‫حد‬ ‫از‬ ‫بيش‬ ‫رمز‬ ‫كردن‬ ‫وارد‬ ‫دفعات‬ ‫تعداد‬',
  '‫‪15‬‬': '‫است‬ ‫نامعتبر‬ ‫كارت‬',
  '‫‪16‬‬': '‫است‬ ‫مجاز‬ ‫حد‬ ‫از‬ ‫بيش‬ ‫وجه‬ ‫برداشت‬ ‫دفعات‬',
  '‫‪17‬‬': '‫است‬ ‫شده‬ ‫منصرف‬ ‫تراكنش‬ ‫انجام‬ ‫از‬ ‫كاربر‬',
  '‫‪18‬‬': '‫است‬ ‫گذشته‬ ‫كارت‬ ‫انقضاي‬ ‫تاريخ‬',
  '‫‪19‬‬': '‫است‬ ‫مجاز‬ ‫حد‬ ‫از‬ ‫بيش‬ ‫وجه‬ ‫برداشت‬ ‫مبلغ‬',
  '‫‪111‬‬': '‫است‬ ‫نامعتبر‬ ‫كارت‬ ‫كننده‬ ‫صادر‬',
  '‫‪112‬‬': '‫كارت‬ ‫كننده‬ ‫صادر‬ ‫سوييچ‬ ‫خطاي‬',
  '‫‪113‬‬': '‫نشد‬ ‫دريافت‬ ‫كارت‬ ‫كننده‬ ‫صادر‬ ‫از‬ ‫پاسخي‬',
  '‫‪114‬‬': '‫نيست‬ ‫تراكنش‬ ‫اين‬ ‫انجام‬ ‫به‬ ‫مجاز‬ ‫كارت‬ ‫دارنده‬',
  '‫‪21‬‬': '‫است‬ ‫نامعتبر‬ ‫پذيرنده‬',
  '‫‪23‬‬': '‫است‬ ‫داده‬ ‫رخ‬ ‫امنيتي‬ ‫خطاي‬',
  '‫‪24‬‬': '‫است‬ ‫نامعتبر‬ ‫پذيرنده‬ ‫كاربري‬ ‫اطلاعات‬',
  '‫‪25‬‬': '‫است‬ ‫نامعتبر‬ ‫مبلغ‬',
  '‫‪31‬‬': '‫است‬ ‫نامعتبر‬ ‫پاسخ‬',
  '‫‪32‬‬': '‫باشد‬ ‫نمي‬ ‫صحيح‬ ‫شده‬ ‫وارد‬ ‫اطلاعات‬ ‫فرمت‬',
  '‫‪33‬‬': '‫است‬ ‫نامعتبر‬ ‫حساب‬',
  '‫‪34‬‬': '‫سيستمي‬ ‫خطاي‬',
  '‫‪35‬‬': '‫است‬ ‫نامعتبر‬ ‫تاريخ‬',
  '‫‪41‬‬': '‫است‬ ‫تكراري‬ ‫درخواست‬ ‫شماره‬',
  '‫‪42‬‬': '‫نشد‬ ‫يافت‬ ‫‪Sale‬‬ ‫تراكنش‬',
  '‫‪43‬‬': '‫است‬ ‫شده‬ ‫داده‬ ‫‪Verify‬‬ ‫درخواست‬ ‫قبلا‬',
  '‫‪44‬‬': '‫نشد‬ ‫يافت‬ ‫‪Verfiy‬‬ ‫درخواست‬',
  '‫‪45‬‬': '‫است‬ ‫شده‬ ‫‪Settle‬‬ ‫تراكنش‬',
  '‫‪46‬‬': '‫است‬ ‫نشده‬ ‫‪Settle‬‬ ‫تراكنش‬',
  '‫‪47‬‬': '‫نشد‬ ‫يافت‬ ‫‪Settle‬‬ ‫تراكنش‬',
  '‫‪48‬‬': '‫است‬ ‫شده‬ ‫‪Reverse‬‬ ‫تراكنش‬',
  '‫‪49‬‬': '‫نشد‬ ‫يافت‬ ‫‪Refund‬‬ ‫تراكنش‬',
  '‫‪412‬‬': '‫است‬ ‫نادرست‬ ‫قبض‬ ‫شناسه‬',
  '‫‪413‬‬': '‫است‬ ‫نادرست‬ ‫پرداخت‬ ‫شناسه‬',
  '‫‪414‬‬': '‫است‬ ‫نامعتبر‬ ‫قبض‬ ‫كننده‬ ‫صادر‬ ‫سازمان‬',
  '‫‪415‬‬': '‫است‬ ‫رسيده‬ ‫پايان‬ ‫به‬ ‫كاري‬ ‫جلسه‬ ‫زمان‬',
  '‫‪416‬‬': '‫اطلاعات‬ ‫ثبت‬ ‫در‬ ‫خطا‬',
  '‫‪417‬‬': '‫است‬ ‫نامعتبر‬ ‫كننده‬ ‫پرداخت‬ ‫شناسه‬',
  '‫‪418‬‬': '‫مشتري‬ ‫اطلاعات‬ ‫تعريف‬ ‫در‬ ‫اشكال‬',
  '‫‪419‬‬': '‫است‬ ‫گذشته‬ ‫مجاز‬ ‫حد‬ ‫از‬ ‫اطلاعات‬ ‫ورود‬ ‫دفعات‬ ‫تعداد‬',
  '‫‪421‬‬': '‫است‬ ‫نامعتبر‬ ‫‪IP‬‬',
  '‫‪51‬‬': '‫است‬ ‫تكراري‬ ‫تراكنش‬',
  '‫‪54‬‬': '‫نيست‬ ‫موجود‬ ‫مرجع‬ ‫تراكنش‬',
  '‫‪55‬‬': '‫است‬ ‫نامعتبر‬ ‫تراكنش‬',
  '‫‪61‬‬': '‫واريز‬ ‫در‬ ‫خطا‬',
};

/*
 * Package's API
 */

export const tConfig = t.interface({
  terminalId: t.number,
  username: t.string,
  password: t.string,
});

export type Config = t.TypeOf<typeof tConfig>;

export const tRequestOptions = t.intersection([
  t.partial({
    payerId: t.number,
  }),
  tBaseRequestOptions,
]);

export type RequestOptions = t.TypeOf<typeof tRequestOptions>;

export const tVerifyOptions = t.intersection([t.interface({}), tBaseVerifyOptions]);

export type VerifyOptions = t.TypeOf<typeof tVerifyOptions>;

export type Receipt = BaseReceipt<CallbackParams>;

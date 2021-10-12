import { ErrorList, LinksObject, PaymentRequestOptions, PaymentReceipt, PaymentVerifyOptions } from '../../types';

/*
 * Zibal's API
 */

export const links: LinksObject = {
  default: {
    REQUEST: 'https://gateway.zibal.ir/v1/request',
    VERIFICATION: 'https://gateway.zibal.ir/v1/verify',
    PAYMENT: 'https://gateway.zibal.ir/start/',
  },
};

/**
 * @link https://docs.zibal.ir/IPG/API#MultiplexingInfo-object
 */
export interface MultiplexingObject {
  /**
   * 	شماره شبای ذی نفع
   */
  bankAccount: string;

  /**
   * 	شناسه ذی نفع
   */
  subMerchantId: string;

  /**
   * 	شناسه کیف پول در پرداختیاری پشتیبانی نمی شود
   */
  walletID: string;

  /**
   * 	مبلغ یا درصد
   */
  amount: number;

  /**
   * 	کارمزد از این آیتم گرفته شود؟
   * فقط در صورتیکه `feeMode: 0` موثر است.
   * اگر مشخص نشود از ذی نفع اصلی با `id: self` کارمزد اخذ میگردد.
   */
  wagePayer: boolean;
}

export interface PurchaseRequest {
  /**
   *  ضروری جهت احراز هویت
   */
  merchant: string;
  /**
   *  مبلغ کل سفارش (به ریال)
   */
  amount: number;
  /**
   *  آدرسی از سایت پذیرنده که زیبال اطلاعات پرداخت را به آن ارسال خواهد کرد.
   */
  callbackUrl: string;
  /**
   *  توضیحات مربوط به سفارش (در گزارشات مختلف نشان‌داده خواهند شد)
   */
  description?: string;
  /**
   *  شناسه سفارش منحصربه‌فرد شما (اختیاری - در گزارشات استفاده می‌شوند)
   */
  orderId?: string;
  /**
   *  با فرستادن شماره موبایل کاربران خود، شماره کارت‌های ثبت‌شده مشتریان در درگاه پرداخت جهت انتخاب ظاهر می‌شوند.
   */
  mobile?: string;
  /**
   *  چنانچه تمایل دارید کاربر فقط از شماره کارت های مشخصی بتواند پرداخت کند لیست کارت (های) 16 رقمی را ارسال کنید.
   */
  allowedCards?: string[];
  /**
   * 	در صورتی که درگاه شما دسترسی ارسال لینک کوتاه پرداخت را داشته باشد، با قراردادن این متغیر برابر با true لینک کوتاه پرداخت برای این تراکنش ساخته می‌شود. لازم به ذکر است در این حالت callbackUrl میتواند ارسال نشود.
   */
  linkToPay?: boolean;
  /**
   * 	با قراردادن این متغیر برابر با true لینک کوتاه پرداخت به شماره mobile ارسالی در همین بدنه ارسال خواهد شد.
   */
  sms?: boolean;
  /**
   *  یا 1	در صورتی که نحوه تسهیم مبلغ شما به‌صورت درصدی می‌باشد، این مقدار را 1 ارسال کنید. (پیش‌فرض :‌ 0)
   */
  percentMode?: 0 | 1;
  /**
   * 	0: کسر از تراکنش
   * 1: کسر کارمزد از کیف پول متصل به درگاه در پرداختیاری پشتیبانی نمی شود
   *  2: افزوده شدن مبلغ کارمزد به مبلغ پرداختی توسط مشتری
   */
  feeMode?: 0 | 1 | 2;

  /**
   * 	آرایه	لیستی از شی آیتم تسهیم
   */
  multiplexingInfos?: MultiplexingObject[];
}
export interface PurchaseResponse {
  /**
   * شناسه منحصربه‌فرد هر جلسه پرداخت درگاه پرداخت اینترنتی زیبال که استعلام وضعیت پرداخت و درخواست‌های گزارش‌گیری با استفاده از این شناسه امکان‌پذیر است.
   */
  trackId: number;

  /**
   * 	نتیجه درخواست. اطلاعات بیشتر درباره این عدد در جدول Result Code زیر آمده‌است.
   * @link Request Code: https://docs.zibal.ir/IPG/API#requestResultCode
   */
  result: number;

  /**
   * 	لینک کوتاه پرداخت
   */
  payLink?: string;

  /**
   * 	پیغام حاوی نتیجه درخواست
   */
  message: string;
}

/**
 * @link https://docs.zibal.ir/IPG/API#requestResultCode
 */
export const purchaseErrors: ErrorList = {
  '102': 'merchant یافت نشد.',
  '103': 'merchant غیرفعال',
  '104': 'merchant نامعتبر',
  '201': 'قبلا تایید شده.',
  '105': 'amount بایستی بزرگتر از 1,000 ریال باشد.',
  '106': 'callbackUrl نامعتبر می‌باشد. (شروع با http و یا https)',
  '113': 'amount مبلغ تراکنش از سقف میزان تراکنش بیشتر است.',
};

export interface CallbackParams {
  /**
   * 	در صورت موفقیت‌آمیز بودن تراکنش 1، در غیر این‌صورت 0 می‌باشد.
   */
  success: '0' | '1';

  /**
   * 	شناسه پیگیری جلسه‌ی پرداخت
   */
  trackId: string;

  /**
   * 	شناسه سفارش ارسال شده در هنگام درخواست پرداخت (در صورت ارسال)
   * @link https://docs.zibal.ir/IPG/API#status-codes
   */
  orderId?: string;

  /**
   * 	وضعیت پرداخت (از طریق جدول وضعیت‌ها می‌توانید مقادیر status را مشاهده نمایید)
   */
  status: '-1' | '-2' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
}

export const CallbackErrors: ErrorList = {
  '-1': 'در انتظار پردخت',
  '-2': 'خطای داخلی',
  '1': 'پرداخت شده - تاییدشده',
  '2': 'پرداخت شده - تاییدنشده',
  '3': 'لغوشده توسط کاربر',
  '4': '‌شماره کارت نامعتبر می‌باشد.',
  '5': '‌موجودی حساب کافی نمی‌باشد.',
  '6': 'رمز واردشده اشتباه می‌باشد.',
  '7': '‌تعداد درخواست‌ها بیش از حد مجاز می‌باشد.',
  '8': '‌تعداد پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد.',
  '9': 'مبلغ پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد.',
  '10': '‌صادرکننده‌ی کارت نامعتبر می‌باشد.',
  '11': '‌خطای سوییچ',
  '12': 'کارت قابل دسترسی نمی‌باشد.',
};

export interface VerifyRequest {
  /**
   * 	ضروری جهت احراز هویت
   */
  merchant: string;

  /**
   * 	شناسه‌ی جلسه‌ی پرداختی که قصد تایید آن را دارید.
   */
  trackId: number;
}

export interface VerifyResponse {
  /**
   * 	تاریخ پرداخت سفارش - به فرمت ISODate (در صورت موفقیت‌آمیز بودن پرداخت)
   */
  paidAt: string;
  /**
   * 	شماره کارت پرداخت کننده (Mask شده)
   */
  cardNumber: string;
  /**
   * 	وضعیت پرداخت (از طریق جدول وضعیت‌ها می‌توانید مقادیر status را مشاهده نمایید)
   */
  status: number;
  /**
   * 	مبلغ سفارش (به ریال)
   */
  amount: number;
  /**
   * 	شناسه مرجع تراکنش (در صورت موفقیت‌آمیز بودن پرداخت)
   */
  refNumber: number;
  /**
   * 	توضیحات تراکنش (در صورت موفقیت‌آمیز بودن پرداخت)
   */
  description: string;
  /**
   * 	شناسه سفارش (در صورت موفقیت‌آمیز بودن پرداخت)
   */
  orderId: string;
  /**
   * 	نتیجه درخواست. اطلاعات بیشتر درباره این عدد در جدول Result Code زیر آمده‌است.
   */
  result: number;
  /**
   * 	پیغام حاوی نتیجه درخواست
   */
  message: string;
}

/**
 * @link https://docs.zibal.ir/IPG/API#verifyResultTable
 */
export const verifyErrors: ErrorList = {
  '102': 'merchant یافت نشد.',
  '103': 'merchant غیرفعال',
  '104': 'merchant نامعتبر',
  '201': 'قبلا تایید شده.',
  '105': 'amount بایستی بزرگتر از 1,000 ریال باشد.',
  '202': 'سفارش پرداخت نشده یا ناموفق بوده است. جهت اطلاعات بیشتر جدول وضعیت‌ها را مطالعه کنید.',
  '203': 'trackId نامعتبر می‌باشد.',
};

/*
 * Package's API
 */

export interface Config {
  sandbox?: boolean;
  merchantId: string;
}
export interface RequestOptions extends PaymentRequestOptions {
  mobile?: string;
  orderId?: string;
  allowedCards?: string[];
  linkToPay?: boolean;
  sms?: boolean;
  percentMode?: 0 | 1;
  feeMode?: 0 | 1 | 2;
  multiplexingInfos?: MultiplexingObject[];
}

export interface VerifyOptions extends PaymentVerifyOptions {}

export interface Receipt extends PaymentReceipt {
  raw: VerifyResponse;
}

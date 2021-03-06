import * as t from 'io-ts';
import { BaseReceipt, ErrorList, LinksObject, tBaseRequestOptions, tBaseVerifyOptions } from '../../types';

/*
 * Sadad's API
 * Currency: IRR
 * link: https://sadadpsp.ir/file/attach/202002/654.pdf
 */

export const links: LinksObject = {
  default: {
    REQUEST: 'https://sadad.shaparak.ir/api/v0/Request/PaymentRequest',
    PAYMENT: 'https://sadad.shaparak.ir/Purchase',
    VERIFICATION: 'https://sadad.shaparak.ir/api/v0/Advice/Verify',
  },
};

export interface RequestPaymentReq {
  /**
   * شماره پذيرنده اختصاص داده شده.
   */
  MerchantId: string;

  /**
   * شماره پايانه اختصاص داده شده
   */
  TerminalId: string;

  /**
   * مبلغ تراکنش
   *
   * در نوع تراکنش های تسهیم به صورت مبلغ،جمع مبالغ تسهیم شده با مبلغ کل تراکنش برابر است
   */
  Amount: number;

  /**
   * شماره سفارش
   * اين شماره به عنوان کد شناسايی يکتا جهت تراکنش پذيرنده شناسايی می شود و می بايست به صورت يکتا (غیر تکراری) جهت هر تراکنش ارسال گردد
   */
  OrderId: number;

  /**
   * تاریخ و زمان ارسال تراکنش
   */
  LocalDateTime: string;

  /**
   * آدرس بازگشت
   */

  ReturnUrl: string;

  /**
   * اطالعات تراکنش به صورت رمزنگاری شده توسط کلید پذيرنده.فرمت فیلد Sign جهت رمزنگاری به شرح ذيل است.
   *
   * `TerminalId;OrderId;Amount`
   *
   * رقم های اطالعاتی فوق الذکر با استفاده از کاراکتر ";" به ترتیب متصل و با استفاده از الگوريتم (PKCS7,ECB(TripleDes رمزنگاری و با فرمت Base64 ارسال می گردد.)کلید ارسالی به پذيرنده با عنوان کلید پذيرنده به صورت Base64 فرمت شده است(
   */
  SignData: string;

  /**
   * اطلاعات اضافی تراکنش
   */
  AdditionalData?: string;

  /**
   * اطلاعات تسهیم
   */
  MultiplexingData?: MultiplexingObject;

  /**
   * شماره تلفن همراه دارنده کارت
   */
  UserId?: number;

  /**
   * نام اپلیکیشن درخواست کننده
   */
  ApplicationName?: string;
}

export interface RequestPaymentRes {
  /**
   * نتیجه تراکنش
   */
  ResCode: number;

  /**
   * توکن
   */
  Token: string;

  /**
   * شرح نتیجه تراکنش
   */
  Description: string;
}

export const tMultiplexingRow = t.interface({
  /**
   * رديف يا شماره شبا حساب
   */
  IbanNumber: t.number,

  /**
   * مبلغ یا درصد
   */
  Value: t.number,
});

export type MultiplexingRow = t.TypeOf<typeof tMultiplexingRow>;

export const tMultiplexingObject = t.interface({
  /**
   * ریز مبالغ و ردیف (یا شماره شبا) حساب های متناظر می بایست ارسال گردد)
   */
  Type: t.union([t.literal('Percentage'), t.literal('Amount')]),

  /**
   * درصد مورد نظر جهت واریز و ردیف یا شماره شبا حساب های مورد نظر می بایست ارسال گردد
   */
  MultiplexingRows: t.array(tMultiplexingRow),
});
export type MultiplexingObject = t.TypeOf<typeof tMultiplexingObject>;

export interface CallbackParams {
  OrderId: number | string;
  HashedCardNo: string;
  PrimaryAccNo: string;
  SwitchResCode: string | number;
  /**
   * 0: success
   * -1: failure
   */
  ResCode: 0 | -1;
  Token: string;
}

export interface VerifyPaymentReq {
  /**
   * توکن
   */
  Token: string;

  /**
   * توکن به صورت رمزنگاری شده
   * با استفاده از کلید پذیرنده
   * الگوریتم TripleDes
   */
  SignData: string;
}

export interface VerifyPaymentRes {
  /**
   * نتیجه تراکنش
   *
   * 0: نتیجه تراکنش موفق است
   *
   * -1:  -نتیجه تراکنش ناموفق است.
   */
  ResCode: 0 | -1;
  /**
   * مبلغ تراکنش
   */
  Amount: number;
  /**
   * شرح نتیجه تراکنش
   */
  Description: string;
  /**
   * شماره مرجع تراکنش
   */
  RetrivalRefNo: string;
  /**
   * شماره پیگیری
   */
  SystemTraceNo: string;
  /**
   * ماره سفارش
   */
  OrderId: number;
}

export const requestErrors: ErrorList = {
  '3': 'پذیرنده کارت فعال نیست لطفا با بخش امور پذيرندگان، تماس حاصل فرمائید',
  '23': 'پذيرنده کارت نامعتبر است لطفا با بخش امور پذيرندگان، تماس حاصل فرمائید',
  '58': 'انجام تراکنش مربوطه توسط پايانه ی انجام دهنده مجاز نمی باشد',
  '61': 'مبلغ تراکنش از حد مجاز بالاتر است',
  '1000': 'ترتیب پارامترهای ارسالی اشتباه می باشد، لطفا مسئول فنی پذيرنده با بانک تماس حاصل فرمايند',
  '1001': 'لطفا مسئول فنی پذيرنده با بانک تماس حاصل فرمايند،پارامترهای پرداخت اشتباه می باشد',
  '1002': 'خطا در سیستم- تراکنش ناموفق',
  '1003': 'IP پذيرنده اشتباه است.لطفا مسئول فنی پذيرنده با بانک تماس حاصل فرمايند',
  '1004': 'لطفا مسئول فنی پذيرنده با بانک تماس حاصل فرمايند،شماره پذيرنده اشتباه است',
  '1005': 'خطای دسترسی:لطفا بعدا تالش فرمايید',
  '1006': 'خطا در سیستم',
  '1011': 'درخواست تکراری- شماره سفارش تکراری می باشد',
  '1012':
    'اطالعات پذيرنده صحیح نیست،يکی از موارد تاريخ،زمان يا کلید تراکنش اشتباه است.لطفا مسئول فنی پذيرنده با بانک تماس حاصل فرمايند',
  '1015': 'پاسخ خطای نامشخص از سمت مرکز',
  '1017': 'مبلغ درخواستی شما جهت پرداخت از حد مجاز تعريف شده برای اين پذيرنده بیشتر است',
  '1018': 'اشکال در تاريخ و زمان سیستم. لطفا تاريخ و زمان سرور خود را با بانک هماهنگ نمايید',
  '1019': 'امکان پرداخت از طريق سیستم شتاب برای اين پذيرنده امکان پذير نیست',
  '1020': 'پذيرنده غیرفعال شده است.لطفا جهت فعال سازی با بانک تماس بگیريد',
  '1023': 'آدرس بازگشت پذيرنده نامعتبر است',
  '1024': 'مهر زمانی پذيرنده نامعتبر است',
  '1025': 'امضا تراکنش نامعتبر است',
  '1026': 'شماره سفارش تراکنش نامعتبر است',
  '1027': 'شماره پذيرنده نامعتبر است',
  '1028': 'شماره ترمینال پذيرنده نامعتبر است',
  '1029':
    'آدرس IP پرداخت در محدوده آدرس های معتبر اعالم شده توسط پذيرنده نیست .لطفا مسئول فنی پذيرنده با بانک تماس حاصل فرمايند',
  '1030':
    'آدرس Domain پرداخت در محدوده آدرس های معتبر اعالم شده توسط پذيرنده نیست .لطفا مسئول فنی پذيرنده با بانک تماس حاصل فرمايند',
  '1031': 'مهلت زمانی شما جهت پرداخت به پايان رسیده است.لطفا مجددا سعی بفرمايید .',
  '1032':
    'پرداخت با اين کارت , برای پذيرنده مورد نظر شما امکان پذير نیست.لطفا از کارتهای مجاز که توسط پذيرنده معرفی شده است , استفاده نمايید.',
  '1033':
    'به علت مشکل در سايت پذيرنده, پرداخت برای اين پذيرنده غیرفعال شده است.لطفا مسوول فنی سايت پذيرنده با بانک تماس حاصل فرمايند.',
  '1036': 'اطالعات اضافی ارسال نشده يا دارای اشکال است',
  '1037': 'شماره پذيرنده يا شماره ترمینال پذيرنده صحیح نمیباشد',
  '1053': 'خطا: درخواست معتبر، از سمت پذيرنده صورت نگرفته است لطفا اطالعات پذيرنده خود را چک کنید.',
  '1055': 'مقدار غیرمجاز در ورود اطالعات',
  '1056': 'سیستم موقتا قطع میباشد.لطفا بعدا تالش فرمايید.',
  '1058': 'سرويس پرداخت اينترنتی خارج از سرويس می باشد.لطفا بعدا سعی بفرمايید.',
  '1061':
    'اشکال در تولید کد يکتا. لطفا مرورگر خود را بسته و با اجرای مجدد مرورگر عملیات پرداخت را انجام دهید )احتمال استفاده از دکمه »Back» مرورگر(',
  '1064': 'لطفا مجددا سعی بفرمايید',
  '1065': 'ارتباط ناموفق .لطفا چند لحظه ديگر مجددا سعی کنید',
  '1066': 'سیستم سرويس دهی پرداخت موقتا غیر فعال شده است',
  '1068': 'با عرض پوزش به علت بروزرسانی , سیستم موقتا قطع میباشد.',
  '1072': 'خطا در پردازش پارامترهای اختیاری پذيرنده',
  '1101': 'مبلغ تراکنش نامعتبر است',
  '1103': 'توکن ارسالی نامعتبر است',
  '1104': 'اطالعات تسهیم صحیح نیست',
  '1105': 'تراکنش بازگشت داده شده است)مهلت زمانی به پايان رسیده است(',
};

export const verifyErrors: ErrorList = {
  '-1': 'پارامترهای ارسالی صحیح نیست و يا تراکنش در سیستم وجود ندارد',
  '101': 'مهلت ارسال تراکنش به پايان رسیده است',
};

/*
 * Package's API
 */

export const tConfig = t.interface({
  merchantId: t.string,
  terminalId: t.string,
  terminalKey: t.string,
});

export type Config = t.TypeOf<typeof tConfig>;

export const tRequestOptions = t.intersection([
  tBaseRequestOptions,
  t.partial({
    mobile: t.string,
    multiplexingData: tMultiplexingObject,
    appName: t.string,
  }),
]);

export type RequestOptions = t.TypeOf<typeof tRequestOptions>;

export const tVerifyOptions = t.intersection([t.interface({}), tBaseVerifyOptions]);

export type VerifyOptions = t.TypeOf<typeof tVerifyOptions>;

export type Receipt = BaseReceipt<CallbackParams>;

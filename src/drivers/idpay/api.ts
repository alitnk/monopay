import { ErrorList, LinksObject, PaymentRequestOptions, PaymentReceipt, PaymentVerifyOptions } from '../../types';

/*
 * IDPay's API
 */

export const links: LinksObject = {
  default: {
    REQUEST: 'https://api.zarinpal.com/pg/v4/payment/request.json',
    VERIFICATION: 'https://api.zarinpal.com/pg/v4/payment/verify.json',
    PAYMENT: 'https://www.zarinpal.com/pg/StartPay/',
  },
  sandbox: {
    REQUEST: 'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
    VERIFICATION: 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
    PAYMENT: 'https://sandbox.zarinpal.com/pg/StartPay/',
  },
};

export interface PurchaseRequest {
  /**
   * سفارش پذیرنده
   * به طول حداکثر 50 کاراکتر
   */
  order_id: string;

  /**
   * مبلغ مورد نظر به ریال
   * مبلغ باید بین 1,000 ریال تا 500,000,000 ریال باشد
   */
  amount: number;

  /**
   * نام پرداخت کننده
   * به طول حداکثر 255 کاراکتر
   */
  name?: string;

  /**
   *تلفن همراه پرداخت کننده
   * به طول 11 کاراکتر
   * مثل 9382198592 یا 09382198592 یا 989382198592
   */
  phone?: string;

  /**
   * پست الکترونیک پرداخت کننده
   * به طول حداکثر 255 کاراکتر
   */
  mail?: string;

  /**
   * توضیح تراکنش
   * به طول حداکثر 255 کاراکتر
   */
  desc?: string;

  /**
   * آدرس بازگشت به سایت پذیرنده
   * به طول حداکثر 2048 کاراکتر
   */
  callback: string;
}

export interface SuccessfulPurchaseResponse {
  /**
   *  کلید منحصر بفرد تراکنش
   */
  id: string;

  /**
   *  لینک پرداخت برای انتقال خریدار به درگاه پرداخت
   */
  link: string;
}

export interface FailedResponse {
  error_code: number;
  error_message: string;
}

export type PurchaseResponse = SuccessfulPurchaseResponse | FailedResponse;

export interface CallbackParamsPOST {
  /**
   * وضعیت تراکنش
   */
  status: number;
  /**
   *  کد رهگیری آیدی پی
   */
  track_id: number;
  /**
   *  کلید منحصر بفرد تراکنش که در مرحله ایجاد تراکنش دریافت شده است
   */
  id: string;
  /**
   *  شماره سفارش پذیرنده که در مرحله ایجاد تراکنش ارسال شده است
   */
  order_id: string;
  /**
   *  مبلغ ثبت شده هنگام ایجاد تراکنش
   */
  amount: number;
  /**
   *  شماره کارت پرداخت کننده با فرمت 123456******1234
   */
  card_no: string;
  /**
   *  هش شماره کارت پرداخت کننده با الگوریتم SHA256
   */
  hashed_card_no: string;
  /**
   *  زمان پرداخت تراکنش
   */
  date: string;
}

export interface CallbackParamsGET {
  /**
   *  وضعیت تراکنش
   */
  status: string;

  /**
   *  کد رهگیری آیدی پی
   */
  track_id: string;

  /**
   *  کلید منحصر بفرد تراکنش که در مرحله ایجاد تراکنش دریافت شده است
   */
  id: string;

  /**
   *  شماره سفارش پذیرنده که در مرحله ایجاد تراکنش ارسال شده است
   */
  order_id: string;
}

export const callbackErrors: ErrorList = {
  '1': 'پرداخت انجام نشده است',
  '2': 'پرداخت ناموفق بوده است',
  '3': 'خطا رخ داده است',
  '4': 'بلوکه شده',
  '5': 'برگشت به پرداخت کننده',
  '6': 'برگشت خورده سیستمی',
  '7': 'انصراف از پرداخت',
  '8': 'به درگاه پرداخت منتقل شد',
  '10': 'در انتظار تایید پرداخت',
  '100': 'پرداخت تایید شده است',
  '101': 'پرداخت قبلا تایید شده است',
  '200': 'به دریافت کننده واریز شد',
};

export interface VerifyRequest {
  /**
   *  بله کلید منحصر بفرد تراکنش که در مرحله ایجاد تراکنش دریافت شده است
   */
  id: string;

  /**
   *  بله شماره سفارش پذیرنده که در مرحله ایجاد تراکنش ارسال شده است
   */
  order_id: string;
}

export interface SuccessfulVerifyResponse {
  /**
   * 	وضعیت تراکنش
   */
  status: number;
  /**
   * 	کد رهگیری آیدی پی
   */
  track_id: number;
  /**
   * 	کلید منحصر بفرد تراکنش که در مرحله ایجاد تراکنش دریافت شده است
   */
  id: string;
  /**
   * 	شماره سفارش پذیرنده که در مرحله ایجاد تراکنش ارسال شده است
   */
  order_id: string;
  /**
   * 	مبلغ ثبت شده هنگام ایجاد تراکنش
   */
  amount: number;
  /**
   * 	زمان ایجاد تراکنش
   */
  date: string;
  /**
   * 	اطلاعات پرداخت تراکنش
   */
  payment: {
    /**
     * 	کد رهگیری پرداخت
     */
    track_id: string;
    /**
     * 	مبلغ قابل پرداخت
     */
    amount: number;
    /**
     * 	شماره کارت پرداخت کننده با فرمت 123456******1234
     */
    card_no: string;
    /**
     * 	هش شماره کارت پرداخت کننده با الگوریتم SHA256
     */
    hashed_card_no: string;
    /**
     * 	زمان پرداخت تراکنش
     */
    date: string;
  };

  /**
   * 	اطلاعات تایید تراکنش
   */
  verify: {
    /**
     * 	زمان تایید تراکنش
     */
    date: string;
  };
}

export type VerifyResponse = SuccessfulVerifyResponse | FailedResponse;

/**
 * @link https://idpay.ir/web-service/v1.1/#ad39f18522
 */
export const errors: ErrorList = {
  // 402
  '11': 'کاربر مسدود شده است.',
  // 403
  '12': 'API Key یافت نشد.',
  // 403
  '13': 'درخواست شما از {ip} ارسال شده است. این IP با IP های ثبت شده در وب سرویس همخوانی ندارد.',
  // 403
  '14': 'وب سرویس شما در حال بررسی است و یا تایید نشده است.',
  // 403
  '21': 'حساب بانکی متصل به وب سرویس تایید نشده است.',
  // 404
  '22': 'وب سریس یافت نشد.',
  // 401
  '23': 'اعتبار سنجی وب سرویس ناموفق بود.',
  // 403
  '24': 'حساب بانکی مرتبط با این وب سرویس غیر فعال شده است.',
  // 406
  '31': 'کد تراکنش id نباید خالی باشد.',
  // 406
  '32': 'شماره سفارش order_id نباید خالی باشد.',
  // 406
  '33': 'مبلغ amount نباید خالی باشد.',
  // 406
  '34': 'مبلغ amount باید بیشتر از {min-amount} ریال باشد.',
  // 406
  '35': 'مبلغ amount باید کمتر از {max-amount} ریال باشد.',
  // 406
  '36': 'مبلغ amount بیشتر از حد مجاز است.',
  // 406
  '37': 'آدرس بازگشت callback نباید خالی باشد.',
  // 406
  '38':
    'درخواست شما از آدرس {domain} ارسال شده است. دامنه آدرس بازگشت callback با آدرس ثبت شده در وب سرویس همخوانی ندارد.',
  // 406
  '41': 'فیلتر وضعیت تراکنش ها می بایست آرایه ای (لیستی) از وضعیت های مجاز در مستندات باشد.',
  // 406
  '42': 'فیلتر تاریخ پرداخت می بایست آرایه ای شامل المنت های min و max از نوع timestamp باشد.',
  // 406
  '43': 'فیلتر تاریخ تسویه می بایست آرایه ای شامل المنت های min و max از نوع timestamp باشد.',
  // 405
  '51': 'تراکنش ایجاد نشد.',
  // 400
  '52': 'استعلام نتیجه ای نداشت.',
  // 405
  '53': 'تایید پرداخت امکان پذیر نیست.',
  // 405
  '54': 'مدت زمان تایید پرداخت سپری شده است.',
};

/*
 * Package's API
 */

export interface Config {
  sandbox?: boolean;
  apiKey: string;
}

export interface RequestOptions extends PaymentRequestOptions {
  mobile?: string;
  email?: string;
  name?: string;
}

export interface VerifyOptions extends PaymentVerifyOptions {}

export interface Receipt extends PaymentReceipt {
  raw: Exclude<VerifyResponse, any[]>;
}

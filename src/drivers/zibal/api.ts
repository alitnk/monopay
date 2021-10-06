export const zibalLinks = {
  default: {
    REQUEST: 'https://gateway.zibal.ir/v1/request',
    VERIFICATION: 'https://gateway.zibal.ir/v1/verify',
    PAYMENT: 'https://gateway.zibal.ir/start/',
  },
};

/**
 * @link https://docs.zibal.ir/IPG/API#MultiplexingInfo-object
 */
export interface ZibalMultiplexingObject {
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

export interface ZibalPurchaseRequest {
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
  multiplexingInfos?: ZibalMultiplexingObject[];
}
export interface ZibalPurchaseResponse {
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

export interface ZibalCallbackParams {
  /**
   * 	در صورت موفقیت‌آمیز بودن تراکنش 1، در غیر این‌صورت 0 می‌باشد.
   */
  success: 0 | 1;

  /**
   * 	شناسه پیگیری جلسه‌ی پرداخت
   */
  trackId: number;

  /**
   * 	شناسه سفارش ارسال شده در هنگام درخواست پرداخت (در صورت ارسال)
   * @link https://docs.zibal.ir/IPG/API#status-codes
   */
  orderId?: number;

  /**
   * 	وضعیت پرداخت (از طریق جدول وضعیت‌ها می‌توانید مقادیر status را مشاهده نمایید)
   */
  status: -1 | -2 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

export interface ZibalVerifyRequest {
  /**
   * 	ضروری جهت احراز هویت
   */
  merchant: string;

  /**
   * 	شناسه‌ی جلسه‌ی پرداختی که قصد تایید آن را دارید.
   */
  trackId: number;
}

export interface ZibalVerifyResponse {
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

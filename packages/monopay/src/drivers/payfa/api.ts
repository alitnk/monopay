/*
 * Payfa's API
 * Currency: IRR
 */

export interface RequestPaymentReq {
  /**
   * 	API Key دریافتی از پنل کاربری شما که بعد از تایید درخواست درگاه صادر میشه
   */
  apiKey: string;
  /**
   * 	مبلغ تراکنش به صورت ریال و بدون رقم اعشار. بزرگتر یا مساوی 10,000 ریال
   */
  amount: number;
  /**
   * 	آدرس بازگشتی که باید به صورت urlencode ارسال بشه و باید با آدرس درگاه پرداخت تایید شده در شبکه پرداخت پی در یک ادرس باشه
   */
  callbackUrl: string;
  /**
   * 	شماره موبایل مشتری جهت ارسال پیامک و ذخیره شماره کارت های مشتری مورد نیاز می باشد
   */
  mobileNumber?: string;
  /**
   * 	شماره کارت مقصد جهت پرداخت با کارت مشخص شده کاربر
   */
  cardNumber?: string;
  /**
   * 	شناسه دلخواه جهت پیگیری پرداخت ها از طریق سرویس های پذیرنده می باشد. این شناسه برای هر پذیرنده یکتا می باشد، در صورت عدم ورود به صورت خودکار ایجاد می گردد
   */
  invoiceId?: string;
}

export interface RequestPaymentRes_Success {
  paymentUrl: string; // آدرس صفحه پرداخت
  approvalUrl: string; // آدرس وب سرویس تاییدیه پرداخت جاری
  paymentId: number; // شماره سیستمی پرداخت
  invoiceId: string | null; // شماره فاکتور
  message: string; // پیام سیستم
  statusCode: number; // کد پاسخ HTTP
}
export interface RequestPaymentRes_Failed {
  message: string | null; // شرح خطا
  errorCode: number; // کد خطا
  statusCode: number; // کد پاسخ HTTP
}

export type RequestPaymentRes = RequestPaymentRes_Success | RequestPaymentRes_Failed;

export interface CallbackParams {
  paymentId: number;
  isSucceed: boolean;
}

export interface VerifyPaymentReq {
  /**
   * API Key دریافتی از پنل کاربری شما که بعد از تایید درخواست درگاه صادر میشه
   */
  apiKey: string;
  /**
   * شناسه پرداخت
   */
  paymentId: number;
}

export interface VerifyPaymentRes_Success {
  cardNo: string; // شماره کارت پرداخت کننده
  transactionId: string; // شناسه تراکنش بانکی
  amount: number; // مبلغ پرداخت شده
  invoiceId: string; // شماره فاکتور
  message: string; // پیام سیستم
  statusCode: number; // کد پاسخ HTTP
}

export interface VerifyPaymentRes_Failed {
  message: string | null; // شرح خطا
  errorCode: number; // کد خطا
  statusCode: number; // کد پاسخ HTTP
}

export type VerifyPaymentRes = VerifyPaymentRes_Success | VerifyPaymentRes_Failed;

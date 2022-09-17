/*
 * Payir's API
 * Currency: IRR
 */

export interface RequestPaymentReq {
  /**
   * 	API Key دریافتی از پنل کاربری شما که بعد از تایید درخواست درگاه صادر میشه
   */
  api: string;
  /**
   * 	مبلغ تراکنش به صورت ریال و بدون رقم اعشار. بزرگتر یا مساوی 10,000 ریال
   */
  amount: number;
  /**
   * 	آدرس بازگشتی که باید به صورت urlencode ارسال بشه و باید با آدرس درگاه پرداخت تایید شده در شبکه پرداخت پی در یک ادرس باشه
   */
  redirect: string;
  /**
   * 	شماره موبایل ( اختیاری ، جهت نمایش شماره کارت Mask شده به کاربر )
   */
  mobile?: string;
  /**
   * 	شماره فاکتور شما ( اختیاری )
   */
  factorNumber?: string;
  /**
   * 	توضیحات تراکنش ( اختیاری ، حداکثر 255 کاراکتر )
   */
  description?: string;
  /**
   * 	اعلام شماره کارت مجاز برای انجام تراکنش ( اختیاری، بصورت عددی (لاتین) و چسبیده بهم در 16 رقم. مثال 6219861012345678 )
   */
  validCardNumber?: string;
  /**
   * 	اعلام کد ملی مجاز برای انجام تراکنش ( اختیاری، بصورت عددی (لاتین) و چسبیده بهم در 10 رقم. مثال 0235790052 )
   */
  nationalCode?: string;
}

export interface RequestPaymentRes_Success {
  status: number;
  token: string;
}
export interface RequestPaymentRes_Failed {
  status: number;
  errorCode: string;
  errorMessage: string;
}

export type RequestPaymentRes = RequestPaymentRes_Success | RequestPaymentRes_Failed;

export interface CallbackParams {
  status: string | number;
  token: string;
}

export interface VerifyPaymentReq {
  /**
   * API Key دریافتی از پنل کاربری شما که بعد از تایید درخواست درگاه صادر میشه
   */
  api: string;
  /**
   * token دریافت شده از مرحله سوم
   */
  token: string;
}

export interface VerifyPaymentRes_Success {
  status: number;
  amount: string;
  transId: string;
  factorNumber: string;
  mobile: string;
  description: string;
  cardNumber: string;
  message: string;
}

export interface VerifyPaymentRes_Failed {
  status: number;
  errorCode: string;
  errorMessage: string;
}

export type VerifyPaymentRes = VerifyPaymentRes_Success | VerifyPaymentRes_Failed;

/**
 * @link https://docs.pay.ir/gateway/#جدول-خطاها
 */
export const errors: Record<string, string> = {
  '0': 'درحال حاضر درگاه بانکی قطع شده و مشکل بزودی برطرف می شود',
  '-1': 'API Key ارسال نمی شود',
  '-2': 'Token ارسال نمی شود',
  '-3': 'API Key ارسال شده اشتباه است',
  '-4': 'امکان انجام تراکنش برای این پذیرنده وجود ندارد',
  '-5': 'تراکنش با خطا مواجه شده است',
  '-6': 'تراکنش تکراریست یا قبلا انجام شده',
  '-7': 'مقدار Token ارسالی اشتباه است',
  '-8': 'شماره تراکنش ارسالی اشتباه است',
  '-9': 'زمان مجاز برای انجام تراکنش تمام شده',
  '-10': 'مبلغ تراکنش ارسال نمی شود',
  '-11': 'مبلغ تراکنش باید به صورت عددی و با کاراکترهای لاتین باشد',
  '-12': 'مبلغ تراکنش می بایست عددی بین 10,000 و 500,000,000 ریال باشد',
  '-13': 'مقدار آدرس بازگشتی ارسال نمی شود',
  '-14': 'آدرس بازگشتی ارسالی با آدرس درگاه ثبت شده در شبکه پرداخت پی یکسان نیست',
  '-15': 'امکان وریفای وجود ندارد. این تراکنش پرداخت نشده است',
  '-16': 'یک یا چند شماره موبایل از اطلاعات پذیرندگان ارسال شده اشتباه است',
  '-17': 'میزان سهم ارسالی باید بصورت عددی و بین 1 تا 100 باشد',
  '-18': 'فرمت پذیرندگان صحیح نمی باشد',
  '-19': 'هر پذیرنده فقط یک سهم میتواند داشته باشد',
  '-20': 'مجموع سهم پذیرنده ها باید 100 درصد باشد',
  '-21': 'Reseller ID ارسالی اشتباه است',
  '-22': 'فرمت یا طول مقادیر ارسالی به درگاه اشتباه است',
  '-23': 'سوییچ PSP ( درگاه بانک ) قادر به پردازش درخواست نیست. لطفا لحظاتی بعد مجددا تلاش کنید',
  '-24': 'شماره کارت باید بصورت 16 رقمی، لاتین و چسبیده بهم باشد',
  '-25': 'امکان استفاده از سرویس در کشور مبدا شما وجود نداره',
  '-26': 'امکان انجام تراکنش برای این درگاه وجود ندارد',
};

export const IPGConfigErrors = [
  '-1',
  '-2',
  '-3',
  '-4',
  '-6',
  '-7',
  '-8',
  '-9',
  '-10',
  '-11',
  '-12',
  '-13',
  '-14',
  '-16',
  '-17',
  '-18',
  '-19',
  '-20',
  '-21',
  '-22',
  '-24',
  '-25',
  '-26',
];

export const IPGUserErrors = ['-5', '-15'];

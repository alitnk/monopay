import { ErrorList, LinksObject, PaymentRequestOptions, PaymentReceipt, PaymentVerifyOptions } from '../../types';

/*
 * Zarinpal's API
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

export interface RequestPaymentReq {
  /**
   * 	بله	كد 36 كاراكتري اختصاصي پذيرنده
   */
  merchant_id: string;

  /**
   * 	بله	مبلغ تراكنش به (ریال)
   */
  amount: number;

  /**
   * 	بله	توضیحات مربوط به تراکنش
   */
  description?: string;

  /**
   * 	بله	صفحه بازگشت مشتري، پس از انجام عمل پرداخت
   */
  callback_url: string;

  /**
   * 		دارای مقدار های mobile و email
   */
  metadata: {
    /**
     * 	خیر	شماره تماس خریدار
     */
    mobile?: string;

    /**
     * 	خیر	ایمیل خریدار
     */
    email?: string;
  };
}

export interface RequestPaymentRes {
  data:
    | {
        code: 100;
        message: string;
        authority: string;
        fee_type: 'Merchant';
        fee: number;
      }
    | any[]; // Note: Zarinpal returns empty arrays instead of null. (probably because it uses PHP)
  errors:
    | {
        code: number;
        message: string;
        validations: Record<string, string> | any[];
      }
    | any[];
}

/**
 * @link https://docs.zarinpal.com/paymentGateway/error.html
 */
export const requestErrors: Record<string, string> = {
  '-9': 'خطای اعتبار سنجی',
  '-10': 'ای پی و يا مرچنت كد پذيرنده صحيح نيست.',
  '-11': 'مرچنت کد فعال نیست لطفا با تیم پشتیبانی ما تماس بگیرید.',
  '-12': 'تلاش بیش از حد در یک بازه زمانی کوتاه.',
  '-15': 'ترمینال شما به حالت تعلیق در آمده با تیم پشتیبانی تماس بگیرید.',
  '-16': 'سطح تاييد پذيرنده پايين تر از سطح نقره اي است.',
};

export interface CallbackParams {
  Authority: string | number;
  Status: 'OK' | 'NOK';
}

export interface VerifyPaymentReq {
  /**
   * 	كد 36 كاراكتري اختصاصي پذيرنده
   */
  merchant_id: string;

  /**
   * 	مبلغ تراكنش به (ریال)
   */
  amount: number;

  /**
   * 	كد يكتاي شناسه مرجع درخواست.
   */
  authority: string;
}

export interface VerifyPaymentRes {
  data:
    | {
        code: number;
        message: string;
        ref_id: number;
        card_pan: string;
        card_hash: string;
        fee_type: string;
        fee: number;
      }
    | any[];
  errors:
    | {
        code: number;
        message: string;
        validations: Record<string, string> | any[];
      }
    | any[];
}

/**
 * @link https://docs.zarinpal.com/paymentGateway/error.html
 */
export const verifyErrors: ErrorList = {
  '-50': 'مبلغ پرداخت شده با مقدار مبلغ در تایید شده متفاوت است.',
  '-51': 'پرداخت ناموفق',
  '-52': 'خطای غیر منتظره با پشتیبانی تماس بگیرید.',
  '-53': 'اتوریتی برای این مرچنت کد نیست.',
  '-54': 'اتوریتی نامعتبر است.',
  '101': 'تراکنش قبلا یک بار تایید شده است.',
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
  email?: string;
}

export interface VerifyOptions extends PaymentVerifyOptions {}

export interface Receipt extends PaymentReceipt {
  raw: Exclude<VerifyPaymentRes['data'], any[]>;
}

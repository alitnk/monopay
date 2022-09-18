/*
 * Zarinpal's API
 * Currency: IRR
 */

export interface RequestPaymentReq {
  /**
   * 		كد 36 كاراكتري اختصاصي پذيرنده
   */
  merchant_id: string;

  /**
   * 		مبلغ تراكنش به (ریال)
   */
  amount: number;

  /**
   * 		توضیحات مربوط به تراکنش
   */
  description?: string;

  /**
   * 		صفحه بازگشت مشتري، پس از انجام عمل پرداخت
   */
  callback_url: string;

  /**
   * 		دارای مقدار های mobile و email
   */
  metadata: {
    /**
     * 		شماره تماس خریدار
     */
    mobile?: string;

    /**
     * 		ایمیل خریدار
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
export const verifyErrors: Record<string, string> = {
  '-50': 'مبلغ پرداخت شده با مقدار مبلغ در تایید شده متفاوت است.',
  '-51': 'پرداخت ناموفق',
  '-52': 'خطای غیر منتظره با پشتیبانی تماس بگیرید.',
  '-53': 'اتوریتی برای این مرچنت کد نیست.',
  '-54': 'اتوریتی نامعتبر است.',
  '101': 'تراکنش قبلا یک بار تایید شده است.',
};

export const IPGConfigErrors = ['-9', '-10', '-11', '-12', '-15', '-16', '-50', '-53', '-54', '101'];

export const IPGUserErrors = ['-51'];

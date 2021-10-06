export const zarinpalLinks = {
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

export interface ZarinpalPurchaseRequest {
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

export interface ZarinpalPurchaseResponse {
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

export interface ZarinpalVerifyRequest {
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

export interface ZarinpalVerifyResponse {
  data:
    | {
        code: number;
        message: string;
        ref_id: number;
        card_pan: String;
        card_hash: String;
        fee_type: String;
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

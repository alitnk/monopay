/*
 * PayPing's API
 * Currency: IRT
 */

export interface RequestPaymentReq {
  /**
   * integer <int32> [ 100 .. 50000000 ]
   */
  amount: number;

  /**
   *شماره موبایل یا ایمیل پرداخت کننده
   */
  payerIdentity?: string;
  /**
   *نام پرداخت کننده
   */
  payerName?: string;
  /**
   *توضیحات
   */
  description?: string;
  /**
   *آدرس صفحه برگشت
   */
  returnUrl: string;

  /**
   *کد ارسالی توسط کاربر
   */
  clientRefId?: string;
}

export interface RequestPaymentRes {
  /**
   * کد پرداخت
   */
  code: string;
}

export interface CallbackParams {
  code: string;
  refid: string;
  clientrefid: string;
  cardnumber: string;
  cardhashpan: string;
}

export interface VerifyPaymentReq {
  /**
   * شماره فاکتور
   */
  refId: string;

  /**
   * مبلغ تراکنش
   * integer <int32> [ 100 .. 50000000 ]
   */
  amount: number;
}

export interface VerifyPaymentRes {
  amount: number;
  cardNumber: string;
  cardHashPan: string;
}

import { Receipt } from '../../receipt';

/**
 * @link https://docs.zarinpal.com/paymentGateway/guide/#بازگشت-به-سایت-پذیرنده
 */
export interface ZarinpalReceipt extends Receipt {
  raw: {
    /**
     * 	عددي كه نشان دهنده موفق بودن يا عدم موفق بودن پرداخت ميباشد.
     */
    code: number;

    /**
     * 	در صورتي كه پرداخت موفق باشد؛ شماره تراكنش پرداخت انجام شده را بر ميگرداند.
     */
    ref_id: number;

    /**
     * 	شماره کارت به صورت Mask
     */
    card_pan: string;

    /**
     * 	هش کارت به صورت SHA256
     */
    card_hash: string;

    /**
     * 	پرداخت کننده کارمزد که در پنل قابل انتخاب است کاربر و یا خود پذیرنده
     */
    fee_type: string;

    /**
     * 	کارمزد
     */
    fee: number;
  };
}

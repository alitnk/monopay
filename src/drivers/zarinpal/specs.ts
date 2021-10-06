import { Invoice } from '../../invoice';

export interface ZarinpalVerificationObject {
  merchantId: string;
  amount: number;
  authority: string;
}

// type ZarinpalStrategyType = 'normal' | 'sandbox';

// const defaultStrategy = 'normal';

export const zarinpalLinks = {
  normal: {
    PURCHASE: 'https://api.zarinpal.com/pg/v4/payment/request.json',
    VERIFICATION: 'https://api.zarinpal.com/pg/v4/payment/verify.json',
    PAYMENT: 'https://www.zarinpal.com/pg/StartPay/',
  },
  sandbox: {
    PURCHASE: 'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
    VERIFICATION: 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
    PAYMENT: 'https://sandbox.zarinpal.com/pg/StartPay/',
  },
};

export interface ZarinpalInvoice extends Invoice {
  mobile?: string;
  email?: string;
}

import { Receipt } from '../../receipt';
import { Driver, DriverWithStrategy } from '../../driver';
import { ZarinpalInvoice } from './invoice';
import { PaymentException } from '../../exception';
import axios from 'axios';

type ZarinpalStrategyType = 'normal' | 'sandbox';
const defaultStrategy = 'normal';

const links = {
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

export interface PurchaseResponse {
  data:
    | {
        code: 100;
        message: string;
        authority: string;
        fee_type: 'Merchant';
        fee: number;
      }
    | []; // Note: Zarinpal returns empty arrays instead of null. (probably because it uses PHP)
  errors:
    | {
        code: number;
        message: string;
        validations: Record<string, string> | [];
      }
    | [];
}

export class Zarinpal implements Driver, DriverWithStrategy<ZarinpalStrategyType> {
  selectedStrategy: ZarinpalStrategyType = defaultStrategy;

  constructor(public invoice: ZarinpalInvoice) {}

  public strategy(strategy: ZarinpalStrategyType) {
    this.selectedStrategy = strategy;
    return this;
  }

  protected links() {
    return links[this.selectedStrategy];
  }

  async purchase(): Promise<string> {
    const { merchantId, amount, callbackUrl, description, email, mobile } = this.invoice;

    const payload = {
      merchant_id: merchantId,
      amount: amount * 10, // convert toman to rial
      callback_url: callbackUrl,
      description: description,
      metadata: {
        email: email,
        mobile: mobile,
      },
    };

    try {
      const response = await axios.post(this.links().PURCHASE, payload, {});

      const { data, errors } = (response.data as unknown) as PurchaseResponse;

      if (!Array.isArray(errors)) {
        const { message } = errors;

        // Error eference: https://docs.zarinpal.com/paymentGateway/error.html
        switch (errors.code) {
          case -9:
            throw new PaymentException(message, 'خطای اعتبار سنجی');
          case -10:
            throw new PaymentException(message, 'ای پی و يا مرچنت كد پذيرنده صحيح نيست');
          case -11:
            throw new PaymentException(message, 'مرچنت کد فعال نیست لطفا با تیم پشتیبانی ما تماس بگیرید');
          case -12:
            throw new PaymentException(message, 'تلاش بیش از حد در یک بازه زمانی کوتاه.');
          case -15:
            throw new PaymentException(message, 'ترمینال شما به حالت تعلیق در آمده با تیم پشتیبانی تماس بگیرید');
          case -16:
            throw new PaymentException(message, 'سطح تاييد پذيرنده پايين تر از سطح نقره اي است.');
          default:
            throw new PaymentException(message);
        }
      }
      return (data as any).authority;
    } catch (e) {
      throw new PaymentException(e.message);
    }
  }

  public async pay(): Promise<string> {
    throw Error();
  }

  public async verify(): Promise<Receipt> {
    throw Error();
  }
}

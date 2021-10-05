import axios from 'axios';
import { ZarinpalPurchaseResponse, ZarinpalInvoice, zarinpalLinks } from './specs';
import { PaymentException } from '../../exception';

export const purchase = async ({ merchantId, amount, callbackUrl, description, mobile, email }: ZarinpalInvoice): Promise<string> => {
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
    const response = await axios.post(zarinpalLinks.normal.PURCHASE, payload, {});

    const { data, errors } = (response.data as unknown) as ZarinpalPurchaseResponse;

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

    return (zarinpalLinks.normal.PAYMENT + (data as any).authority) as string;
  } catch (e) {
    throw new PaymentException((e as any).message);
  }
};

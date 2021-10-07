import axios from 'axios';
import { ZarinpalPurchaseRequest, ZarinpalPurchaseResponse } from './api';
import { getZarinpalLinks } from './utils';
import { ZarinpalInvoice, ZarinpalOptions } from './types';
import { PaymentException } from '../../exception';

export const purchase = async (invoice: ZarinpalInvoice, options?: ZarinpalOptions): Promise<string> => {
  const { merchantId, amount, callbackUrl, mobile, email, ...fields } = invoice;
  let response;

  try {
    response = await axios.post<ZarinpalPurchaseRequest, { data: ZarinpalPurchaseResponse }>(
      getZarinpalLinks(options?.sandbox).REQUEST,
      {
        merchant_id: merchantId,
        amount: amount * 10, // convert toman to rial
        callback_url: callbackUrl,
        metadata: { email, mobile },
        ...fields,
      }
    );
    const { data, errors } = response.data;

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      const { message, code } = errors;

      // Error eference: https://docs.zarinpal.com/paymentGateway/error.html
      switch (code) {
        case -9:
          throw new PaymentException(message, 'خطای اعتبار سنجی');
        case -10:
          throw new PaymentException(message, 'ای پی و يا مرچنت كد پذيرنده صحيح نيست.');
        case -11:
          throw new PaymentException(message, 'مرچنت کد فعال نیست لطفا با تیم پشتیبانی ما تماس بگیرید.');
        case -12:
          throw new PaymentException(message, 'تلاش بیش از حد در یک بازه زمانی کوتاه.');
        case -15:
          throw new PaymentException(message, 'ترمینال شما به حالت تعلیق در آمده با تیم پشتیبانی تماس بگیرید.');
        case -16:
          throw new PaymentException(message, 'سطح تاييد پذيرنده پايين تر از سطح نقره اي است.');
        default:
          throw new PaymentException(message);
      }
    }

    return (getZarinpalLinks(options?.sandbox).PAYMENT + (data as any).authority) as string;
  } catch (e) {
    if (e instanceof PaymentException) throw e;
    else if (e instanceof Error) throw new PaymentException(e.message);
    else throw new Error('Unknown error happened');
  }
};

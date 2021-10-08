import axios from 'axios';
import { PaymentException, VerificationException } from '../../exception';
import { Receipt } from '../../receipt';
import { Requestish } from '../../utils';
import { ZarinpalVerifyRequest, ZarinpalVerifyResponse } from './api';
import { ZarinpalVerifyOptions } from './types';
import { getZarinpalLinks } from './utils';

export const verify = async (options: Omit<ZarinpalVerifyOptions, 'code'>, request: Requestish): Promise<Receipt> => {
  const { authority, status } = request.query;
  if (status !== 'OK') {
    throw new PaymentException('Payment canceled by the user.', 'پرداخت توسط کاربر لغو شد.');
  }

  return await verifyManually({ ...options, code: authority });
};

export const verifyManually = async (options: ZarinpalVerifyOptions): Promise<Receipt> => {
  const { sandbox, code, merchantId, ...otherOptions } = options;

  try {
    const response = await axios.post<ZarinpalVerifyRequest, { data: ZarinpalVerifyResponse }>(
      getZarinpalLinks(sandbox).VERIFICATION,
      {
        authority: code,
        merchant_id: merchantId,
        ...otherOptions,
      },
      {}
    );
    const { data, errors } = response.data;

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      const { message, code } = errors;

      // Error eference: https://docs.zarinpal.com/paymentGateway/error.html
      switch (code) {
        case -50:
          throw new VerificationException(message, 'مبلغ پرداخت شده با مقدار مبلغ در تایید شده متفاوت است.');
        case -51:
          throw new VerificationException(message, 'پرداخت ناموفق');
        case -52:
          throw new VerificationException(message, 'خطای غیر منتظره با پشتیبانی تماس بگیرید.');
        case -53:
          throw new VerificationException(message, 'اتوریتی برای این مرچنت کد نیست.');
        case -54:
          throw new VerificationException(message, 'اتوریتی نامعتبر است.');
        case 101:
          throw new VerificationException(message, 'تراکنش قبلا یک بار تایید شده است.');
        default:
          throw new VerificationException(message);
      }
    }

    return {
      referenceId: (data as any).ref_id,
      raw: data,
    };
  } catch (e) {
    if (e instanceof VerificationException) throw e;
    else if (e instanceof Error) throw new VerificationException(e.message);
    else throw new Error('Unknown error happened');
  }
};

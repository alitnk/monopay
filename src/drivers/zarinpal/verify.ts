import axios from 'axios';
import { PaymentException, VerificationException } from '../../exception';
import { Receipt } from '../../receipt';
import { Requestish } from '../../utils';
import { ZarinpalVerifyRequest, ZarinpalVerifyResponse } from './api';
import { ZarinpalVerifier, ZarinpalOptions } from './types';
import { getZarinpalLinks } from './utils';

export const verify = async (
  fields: Omit<ZarinpalVerifier, 'code'>,
  request: Requestish,
  options?: ZarinpalOptions
): Promise<Receipt> => {
  const { authority, status } = request.query;
  if (status !== 'OK') {
    throw new PaymentException('Payment canceled by the user.', 'پرداخت توسط کاربر لغو شد.');
  }

  return await verifyManually({ ...fields, code: authority }, options);
};

export const verifyManually = async (verifier: ZarinpalVerifier, options?: ZarinpalOptions): Promise<Receipt> => {
  const { code, merchant, ...verifiers } = verifier;

  try {
    const response = await axios.post<ZarinpalVerifyRequest, { data: ZarinpalVerifyResponse }>(
      getZarinpalLinks(options?.sandbox).VERIFICATION,
      {
        authority: code,
        merchant_id: merchant,
        ...verifiers,
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

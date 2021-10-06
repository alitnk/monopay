import axios from 'axios';
import { PaymentException, VerificationException } from '../../exception';
import { Receipt } from '../../receipt';
import { ExpressLikeRequest } from '../../utils';
import { zarinpalLinks, ZarinpalVerificationObject } from './specs';

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

export const verify = async (
  options: Omit<ZarinpalVerificationObject, 'authority'>,
  request: ExpressLikeRequest
): Promise<Receipt> => {
  const { authority, status } = request.params;
  if (status !== 'OK') {
    throw new PaymentException('Payment canceled by the user.', 'پرداخت توسط کاربر لغو شد.');
  }
  return verifyManually({ ...options, authority: authority });
};

export const verifyManually = async ({
  authority,
  amount,
  merchantId,
}: ZarinpalVerificationObject): Promise<Receipt> => {
  try {
    const response = await axios.post<any, { data: ZarinpalVerifyResponse }>(
      zarinpalLinks.normal.VERIFICATION,
      {
        authority,
        amount,
        merchant_id: merchantId,
      },
      {}
    );
    const { data, errors } = response.data;

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      const { message, code } = errors;

      // Error eference: https://docs.zarinpal.com/paymentGateway/error.html
      switch (errors.code) {
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
      referenceId: (data as any).reference_id,
      fee: (data as any).fee,
    };
  } catch (e) {
    throw new VerificationException((e as Error).message);
  }
};

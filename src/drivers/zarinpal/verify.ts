import axios from 'axios';
import { PaymentException, VerificationException } from '../../exception';
import { Receipt } from '../../types';
import { Requestish } from '../../utils';
import { ZarinpalCallbackParams, zarinpalVerifyErrors, ZarinpalVerifyRequest, ZarinpalVerifyResponse } from './api';
import { ZarinpalVerifyOptions } from './types';
import { getZarinpalLinks } from './utils';

export const verify = async (
  options: ZarinpalVerifyOptions,
  request: Requestish<ZarinpalCallbackParams>
): Promise<Receipt> => {
  const { Authority: authority, Status: status } = request.query;
  const { sandbox, merchantId, ...otherOptions } = options;

  if (status !== 'OK') {
    throw new PaymentException('پرداخت توسط کاربر لغو شد.');
  }

  try {
    const response = await axios.post<ZarinpalVerifyRequest, { data: ZarinpalVerifyResponse }>(
      getZarinpalLinks(sandbox).VERIFICATION,
      {
        authority: authority.toString(),
        merchant_id: merchantId,
        ...otherOptions,
      },
      {}
    );
    const { data, errors } = response.data;

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      const { code } = errors;
      throw new VerificationException(zarinpalVerifyErrors[code.toString()]);
    }

    return {
      transactionId: (data as any).ref_id,
      cardPan: (data as any).card_pan,
      raw: data,
    };
  } catch (e) {
    if (e instanceof VerificationException) throw e;
    else if (e instanceof Error) throw new VerificationException(e.message);
    else throw new Error('Unknown error happened');
  }
};

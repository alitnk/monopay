import axios from 'axios';
import { PaymentException, PolypayException } from '../../exception';
import { VerificationException } from '../../exception';
import { Receipt } from '../../types';
import { Requestish } from '../../utils';
import * as API from './api';
import { ZarinpalVerifyOptions } from './types';
import { getZarinpalLinks } from './utils';

export const verify = async (
  options: ZarinpalVerifyOptions,
  request: Requestish<API.CallbackParams>
): Promise<Receipt> => {
  const { Authority: authority, Status: status } = request.query;
  const { sandbox, merchantId, ...otherOptions } = options;

  if (status !== 'OK') {
    throw new PaymentException('پرداخت توسط کاربر لغو شد.');
  }

  try {
    const response = await axios.post<API.VerifyRequest, { data: API.VerifyResponse }>(
      getZarinpalLinks(sandbox).VERIFICATION,
      {
        authority: authority.toString(),
        merchant_id: merchantId,
        ...otherOptions,
      },
      {}
    );
    const { data, errors } = response.data;

    if (!Array.isArray(data)) {
      // It was successful (`data` is an object)
      return {
        transactionId: data.ref_id,
        cardPan: data.card_pan,
        raw: data,
      };
    }

    if (!Array.isArray(errors)) {
      // There are errors (`errors` is an object)
      const { code } = errors;
      throw new VerificationException(API.verifyErrors[code.toString()]);
    }

    throw new VerificationException();
  } catch (e) {
    if (e instanceof PolypayException) throw e;
    else if (e instanceof Error) throw new VerificationException(e.message);
    else throw new Error('Unknown error happened');
  }
};

import axios from 'axios';
import { PaymentException, PolypayException, VerificationException } from '../../exception';
import { Requestish } from '../../utils';
import * as API from './api';
import { ZibalReceipt, ZibalVerifyOptions } from './types';

export const verify = async (
  options: ZibalVerifyOptions,
  request: Requestish<API.CallbackParams>
): Promise<ZibalReceipt> => {
  const { status, success, trackId } = request.query;
  const { sandbox } = options;
  let { merchantId } = options;

  if (sandbox) merchantId = 'zibal';

  if (success === '0') {
    throw new PaymentException(API.CallbackErrors[status]);
  }

  try {
    const response = await axios.post<API.VerifyRequest, { data: API.VerifyResponse }>(API.links.default.VERIFICATION, {
      merchant: merchantId,
      trackId: +trackId,
    });

    const { result } = response.data;

    if (result !== 100) {
      throw new VerificationException(API.verifyErrors[result.toString()]);
    }

    return {
      raw: response.data,
      transactionId: response.data.refNumber,
      cardPan: response.data.cardNumber,
    };
  } catch (e) {
    if (e instanceof PolypayException) throw e;
    else if (e instanceof Error) throw new VerificationException(e.message);
    else throw new Error('Unknown error happened');
  }
};

import axios from 'axios';
import { PaymentException, VerificationException } from '../../exception';
import { Requestish } from '../../utils';
import {
  zibalCallbackErrors,
  ZibalCallbackParams,
  zibalLinks,
  zibalVerifyErrors,
  ZibalVerifyRequest,
  ZibalVerifyResponse,
} from './api';
import { ZibalReceipt, ZibalVerifyOptions } from './types';

export const verify = async (
  options: ZibalVerifyOptions,
  request: Requestish<ZibalCallbackParams>
): Promise<ZibalReceipt> => {
  const { status, success, trackId } = request.query;
  const { sandbox } = options;
  let { merchantId } = options;

  if (sandbox) merchantId = 'zibal';

  if (success === '0') {
    throw new PaymentException('Payment exception', zibalCallbackErrors[status]);
  }

  try {
    const response = await axios.post<ZibalVerifyRequest, { data: ZibalVerifyResponse }>(
      zibalLinks.default.VERIFICATION,
      {
        merchant: merchantId,
        trackId: +trackId,
      }
    );

    const { result, message } = response.data;

    if (result !== 100) {
      throw new VerificationException(message, zibalVerifyErrors[result.toString()]);
    }

    return { raw: response.data, referenceId: response.data.refNumber };
  } catch (e) {
    if (e instanceof VerificationException) throw e;
    else if (e instanceof Error) throw new VerificationException(e.message);
    else throw new Error('Unknown error happened');
  }
};

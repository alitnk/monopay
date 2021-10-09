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
  options: Omit<ZibalVerifyOptions, 'code'>,
  request: Requestish<ZibalCallbackParams>
): Promise<ZibalReceipt> => {
  if (request.query.success === '0') {
    throw new PaymentException('Payment exception', zibalCallbackErrors[request.query.status]);
  }

  return await verifyManually({ ...options, code: request.query.trackId.toString() });
};

export const verifyManually = async (options: ZibalVerifyOptions): Promise<ZibalReceipt> => {
  let { sandbox, merchantId, code } = options;

  if (sandbox) merchantId = 'zibal';

  try {
    const response = await axios.post<ZibalVerifyRequest, { data: ZibalVerifyResponse }>(
      zibalLinks.default.VERIFICATION,
      {
        merchant: merchantId,
        trackId: +code,
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

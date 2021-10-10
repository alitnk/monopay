import { SamanReceipt, SamanVerifyOptions } from './types';
import soap from 'soap';
import * as API from './api';
import { Requestish } from '../../utils';
import { VerificationException, PaymentException } from '../../exception';

export const verify = async (
  options: SamanVerifyOptions,
  req: Requestish<API.CallbackParams>
): Promise<SamanReceipt> => {
  const { merchantId } = options;
  const { RefNum: referenceId, TraceNo: transactionId, Status: status } = req.query;
  if (!referenceId) {
    throw new PaymentException(API.purchaseErrors[status.toString()]);
  }

  const soapClient = await soap.createClientAsync(API.links.default.VERIFICATION);

  // TODO: use try-catch here
  const responseStatus = +(await soapClient.verifyTransaction(referenceId, merchantId));

  if (responseStatus < 0) {
    throw new VerificationException(API.purchaseErrors[responseStatus]);
  }

  return {
    transactionId: +transactionId,
    cardPan: req.query.SecurePan,
    raw: req.query,
  };
};

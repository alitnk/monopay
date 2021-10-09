import { SamanReceipt, SamanVerifyOptions } from './types';
import soap from 'soap';
import { samanPurchaseErrors, SamanCallbackParams, samanLinks } from './api';
import { Requestish } from '../../utils';
import { VerificationException } from '../../exception';

export const verify = async (
  options: SamanVerifyOptions,
  req: Requestish<SamanCallbackParams>
): Promise<SamanReceipt> => {
  const { merchantId } = options;
  const { RefNum: referenceId, TraceNo: transactionId } = req.query;

  const soapClient = await soap.createClientAsync(samanLinks.default.VERIFICATION);

  // TODO: use try-catch here
  const responseStatus = +(await soapClient.verifyTransaction(referenceId, merchantId));

  if (responseStatus < 0) {
    throw new VerificationException(samanPurchaseErrors[responseStatus]);
  }

  return {
    transactionId,
    raw: req.query,
  };
};

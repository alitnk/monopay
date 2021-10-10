import { SadadReceipt, SadadVerifyOptions } from './types';
import * as API from './api';
import { Requestish } from '../../utils';
import { VerificationException, PaymentException } from '../../exception';
import axios from 'axios';
import { TripleDES } from 'crypto-js';
import { signData } from './utils';

export const verify = async (
  options: SadadVerifyOptions,
  req: Requestish<API.CallbackParams>
): Promise<SadadReceipt> => {
  const { terminalKey } = options;
  const { HashedCardNo, ResCode, Token } = req.query;
  if (ResCode === 0) {
    throw new PaymentException('تراکنش توسط کاربر لغو شد.');
  }

  const response = await axios.post<API.VerifyRequest, { data: API.VerifyResponse }>(API.links.default.VERIFICATION, {
    SignData: signData(Token, terminalKey),
    Token,
  });

  const { ResCode: verificationResCode, SystemTraceNo } = response.data;

  if (verificationResCode !== 0) {
    throw new VerificationException(API.verifyErrors[verificationResCode.toString()]);
  }

  return {
    transactionId: SystemTraceNo,
    cardPan: HashedCardNo,
    raw: req.query,
  };
};

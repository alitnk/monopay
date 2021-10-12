import axios from 'axios';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import { Requestish } from '../../types';
import * as API from './api';
import CryptoJS from 'crypto-js';

export class Sadad extends Driver<API.Config> {
  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    const { amount, callbackUrl, mobile, multiplexingData, appName } = options;
    const { merchantId, terminalId, terminalKey } = this.config;

    const orderId = this.generateId();
    const response = await axios.post<API.PurchaseRequest, { data: API.PurchaseResponse }>(this.getLinks().REQUEST, {
      Amount: amount,
      LocalDateTime: new Date().toISOString(),
      MerchantId: merchantId,
      TerminalId: terminalId,
      OrderId: orderId,
      ReturnUrl: callbackUrl,
      ApplicationName: appName,
      SignData: signData(`${terminalId};${orderId};${amount}`, terminalKey),
      MultiplexingData: multiplexingData,
      UserId: mobile ? +mobile : undefined,
    });

    if (response.data.ResCode !== 0) {
      throw new RequestException(API.requestErrors[response.data.ResCode.toString()]);
    }

    return this.makeRequestInfo(response.data.Token, 'GET', this.getLinks().PAYMENT, {
      Token: response.data.Token,
    });
  };

  verifyPayment = async (_options: API.VerifyOptions, req: Requestish<API.CallbackParams>): Promise<API.Receipt> => {
    const { HashedCardNo, ResCode, Token } = req.query;
    const { terminalKey } = this.config;

    if (ResCode !== 0) {
      throw new PaymentException('تراکنش توسط کاربر لغو شد.');
    }

    const response = await axios.post<API.VerifyRequest, { data: API.VerifyResponse }>(this.getLinks().VERIFICATION, {
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
}

const signData = (message: string, key: string): string => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

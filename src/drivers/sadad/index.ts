import axios from 'axios';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';
import CryptoJS from 'crypto-js';

export class Sadad extends Driver<API.Config> {
  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    const { amount, callbackUrl, mobile, multiplexingData, appName } = options;
    const { merchantId, terminalId, terminalKey } = this.config;

    const orderId = this.generateId();
    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(this.getLinks().REQUEST, {
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

  verifyPayment = async (_options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    const { HashedCardNo, ResCode, Token } = params;
    const { terminalKey } = this.config;

    if (ResCode !== 0) {
      throw new PaymentException('تراکنش توسط کاربر لغو شد.');
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(this.getLinks().VERIFICATION, {
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
      raw: {
        HashedCardNo: params.HashedCardNo,
        OrderId: params.OrderId,
        PrimaryAccNo: params.PrimaryAccNo,
        ResCode: params.ResCode,
        SwitchResCode: params.SwitchResCode,
        Token: params.Token,
      },
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

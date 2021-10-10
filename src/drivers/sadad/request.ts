import axios from 'axios';
import { str as crc32Encode } from 'crc-32';
import dateformat from 'dateformat';
import { v4 as uuidv4 } from 'uuid';
import { RequestException } from '../../exception';
import { PaymentInfo } from '../../types';
import * as API from './api';
import { SadadPurchaseOptions } from './types';
import { signData } from './utils';

export const request = async (options: SadadPurchaseOptions): Promise<PaymentInfo> => {
  let { merchantId, terminalId, terminalKey, amount, callbackUrl, mobile, multiplexingData, appName } = options;

  amount = amount * 10;
  const orderId = crc32Encode(uuidv4());
  const response = await axios.post<API.PurchaseRequest, { data: API.PurchaseResponse }>(API.links.default.REQUEST, {
    Amount: amount * 10,
    LocalDateTime: dateformat(new Date(), 'm/d/Y g:i:s a'),
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

  return {
    method: 'GET',
    url: API.links.default.PAYMENT,
    params: {
      Token: response.data.Token,
    },
  };
};

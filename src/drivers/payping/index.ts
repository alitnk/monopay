import axios from 'axios';
import { Driver } from '../../driver';
import { RequestException, VerificationException } from '../../exceptions';
import { ErrorList } from '../../types';
import * as API from './api';

export class PayPing extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.tConfig);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.tRequestOptions);

    const { amount, callbackUrl, mobile, email, name, description } = options;
    let response;

    try {
      response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(this.getLinks().REQUEST, {
        amount: amount * 10,
        returnUrl: callbackUrl,
        description,
        payerIdentity: mobile || email,
        payerName: name,
      });
    } catch (error) {
      throw new RequestException(this.statusToMessage((error as any).response.status));
    }

    const { code } = response.data;

    return this.makeRequestInfo(code, 'GET', this.getLinks().PAYMENT + code);
  };

  verifyPayment = async (options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    const { code, refid } = params;
    const { amount } = options;
    let response;

    try {
      response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(this.getLinks().VERIFICATION, {
        amount: amount * 10,
        refId: code,
      });
    } catch (error) {
      throw new VerificationException(this.statusToMessage((error as any).response.status));
    }

    const { cardNumber } = response.data;

    return {
      raw: response.data,
      transactionId: refid,
      cardPan: cardNumber,
    };
  };

  statusToMessage(status = 500): string {
    const map: ErrorList = {
      '400': 'مشکلی در اطلاعات ارسالی وجود دارد.',
      '401': 'شما به این آیتم دسترسی ندارید.',
      '403': 'دسترسی شما غیر مجاز است.',
      '404': 'یافت نشد.',
      '500': 'مشکلی از طرف درگاه پرداخت رخ داده.',
      '502': 'سرور پراکسی با خطا مواجه شده است.',
      '503': 'سرور درگاه پرداخت در حال حاضر پاسخ‌گو نیست.',
    };

    return map[status.toString() || '500'];
  }
}

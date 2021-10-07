import axios from 'axios';
import { PaymentException, VerificationException } from '../../exception';
import { Requestish } from '../../utils';
import { ZibalCallbackParams, zibalLinks, ZibalVerifyRequest, ZibalVerifyResponse } from './api';
import { ZibalOptions, ZibalReceipt, ZibalVerifier } from './types';

export const verify = async (
  fields: Omit<ZibalVerifier, 'code'>,
  request: Requestish<ZibalCallbackParams>,
  options?: ZibalOptions
): Promise<ZibalReceipt> => {
  if (request.query.success === '0') {
    switch (+request.query.status) {
      case -1:
        throw new PaymentException('Payment exception', 'در انتظار پردخت');
      case -2:
        throw new PaymentException('Payment exception', 'خطای داخلی');
      case 1:
        throw new PaymentException('Payment exception', 'پرداخت شده - تاییدشده');
      case 2:
        throw new PaymentException('Payment exception', 'پرداخت شده - تاییدنشده');
      case 3:
        throw new PaymentException('Payment exception', 'لغوشده توسط کاربر');
      case 4:
        throw new PaymentException('Payment exception', '‌شماره کارت نامعتبر می‌باشد.');
      case 5:
        throw new PaymentException('Payment exception', '‌موجودی حساب کافی نمی‌باشد.');
      case 6:
        throw new PaymentException('Payment exception', 'رمز واردشده اشتباه می‌باشد.');
      case 7:
        throw new PaymentException('Payment exception', '‌تعداد درخواست‌ها بیش از حد مجاز می‌باشد.');
      case 8:
        throw new PaymentException('Payment exception', '‌تعداد پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد.');
      case 9:
        throw new PaymentException('Payment exception', 'مبلغ پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد.');
      case 10:
        throw new PaymentException('Payment exception', '‌صادرکننده‌ی کارت نامعتبر می‌باشد.');
      case 11:
        throw new PaymentException('Payment exception', '‌خطای سوییچ');
      case 12:
        throw new PaymentException('Payment exception', 'کارت قابل دسترسی نمی‌باشد.');
    }
  }

  return await verifyManually({ ...fields, code: request.query.trackId.toString() }, options);
};

export const verifyManually = async (verifier: ZibalVerifier, options?: ZibalOptions): Promise<ZibalReceipt> => {
  let { merchant, code } = verifier;

  if (options?.strategy === 'sandbox') merchant = 'zibal';

  try {
    const response = await axios.post<ZibalVerifyRequest, { data: ZibalVerifyResponse }>(
      zibalLinks.default.VERIFICATION,
      {
        merchant,
        trackId: +code,
      }
    );

    const { result, message } = response.data;

    if (result !== 100) {
      // Error eference: https://docs.zibal.ir/IPG/API#verifyResultTable
      switch (result) {
        case 102:
          throw new VerificationException(message, 'merchant یافت نشد.');
        case 103:
          throw new VerificationException(message, 'merchant غیرفعال');
        case 104:
          throw new VerificationException(message, 'merchant نامعتبر');
        case 201:
          throw new VerificationException(message, 'قبلا تایید شده.');
        case 105:
          throw new VerificationException(message, 'amount بایستی بزرگتر از 1,000 ریال باشد.');
        case 202:
          throw new VerificationException(
            message,
            'سفارش پرداخت نشده یا ناموفق بوده است. جهت اطلاعات بیشتر جدول وضعیت‌ها را مطالعه کنید.'
          );
        case 203:
          throw new VerificationException(message, 'trackId نامعتبر می‌باشد.');
        default:
          throw new VerificationException(message);
      }
    }
    return { raw: response.data, referenceId: response.data.refNumber };
  } catch (e) {
    if (e instanceof VerificationException) throw e;
    else if (e instanceof Error) throw new VerificationException(e.message);
    else throw new Error('Unknown error happened');
  }
};

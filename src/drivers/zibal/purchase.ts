import axios from 'axios';
import { PaymentException } from '../../exception';
import { zibalLinks, ZibalPurchaseRequest, ZibalPurchaseResponse } from './api';
import { ZibalInvoice, ZibalOptions } from './types';

export const purchase = async (invoice: ZibalInvoice, options?: ZibalOptions) => {
  let { amount, merchant, ...fields } = invoice;

  if (options?.strategy === 'sandbox') merchant = 'zibal';

  try {
    const response = await axios.post<ZibalPurchaseRequest, { data: ZibalPurchaseResponse }>(
      zibalLinks.default.REQUEST,
      { merchant, amount: amount * 10, ...fields }
    );
    const { message, result, payLink, trackId } = response.data;

    if (result !== 100) {
      // Error eference: https://docs.zibal.ir/IPG/API#requestResultCode
      switch (result) {
        case 102:
          throw new PaymentException(message, 'merchant یافت نشد.');
        case 103:
          throw new PaymentException(message, 'merchant غیرفعال');
        case 104:
          throw new PaymentException(message, 'merchant نامعتبر');
        case 201:
          throw new PaymentException(message, 'قبلا تایید شده.');
        case 105:
          throw new PaymentException(message, 'amount بایستی بزرگتر از 1,000 ریال باشد.');
        case 106:
          throw new PaymentException(message, 'callbackUrl نامعتبر می‌باشد. (شروع با http و یا https)');
        case 113:
          throw new PaymentException(message, 'amount مبلغ تراکنش از سقف میزان تراکنش بیشتر است.');
        default:
          throw new PaymentException(message);
      }
    }
    return payLink || zibalLinks.default.PAYMENT + trackId;
  } catch (e) {
    if (e instanceof PaymentException) throw e;
    else if (e instanceof Error) throw new PaymentException(e.message);
    else throw new Error('Unknown error happened');
  }
};

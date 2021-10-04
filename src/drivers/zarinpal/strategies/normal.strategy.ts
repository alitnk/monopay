import { IReceipt } from '../../../receipt';
import { ZarinpalInvoice } from '../invoice';
import axios from 'axios';

export class ZarinpalNormalStrategy {
  constructor(protected readonly invoice: ZarinpalInvoice) {}

  links = {
    PURCHASE: 'https://ir.zarinpal.com/pg/services/WebGate/wsdl',
    PAYMENT: 'https://www.zarinpal.com/pg/StartPay/',
    VERIFICATION: 'https://ir.zarinpal.com/pg/services/WebGate/wsdl',
  };
  async purchase(): Promise<string> {
    const { merchantId, amount, callbackUrl, description, email, mobile } = this.invoice;

    const data = {
      MerchantID: merchantId,
      Amount: amount * 10, // convert toman to rial
      CallbackURL: callbackUrl,
      Description: description,
      Email: email,
      Mobile: mobile,
    };

    try {
      await axios.post(this.links.PURCHASE, data, {
        headers: {
          'CONTENT-Type': 'application/json',
        },
      });

      // if (responseData.errors) {
      // }

      // return responseData.data.authority;
    } catch (e) {
      console.log(e);
    }
    return 'ok';
  }

  pay(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  verify(): Promise<IReceipt> {
    throw new Error('Method not implemented.');
  }
}

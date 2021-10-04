import { IReceipt } from '../../../receipt';
import { ZarinpalStrategy } from '../driver';

export class ZarinpalNormalStrategy extends ZarinpalStrategy {
  links = {
    PURCHASE: 'https://ir.zarinpal.com/pg/services/WebGate/wsdl',
    PAYMENT: 'https://www.zarinpal.com/pg/StartPay/',
    VERIFICATION: 'https://ir.zarinpal.com/pg/services/WebGate/wsdl',
  };
  async purchase(): Promise<string> {
    const { merchantId, amount, callbackUrl, description, metadata } = this.invoice;

    const data = {
      merchant_id: merchantId,
      amount: amount * 10, // convert toman to rial
      callback_url: callbackUrl,
      description: description,
      metadata: metadata,
    };

    // try {
    const response = await fetch(this.links.PURCHASE, {
      body: JSON.stringify(data),
      headers: {
        'CONTENT-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (responseData.errors) {
    }

    return responseData.data.authority;
    // } catch (e) {}
  }

  pay(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  verify(): Promise<IReceipt> {
    throw new Error('Method not implemented.');
  }
}

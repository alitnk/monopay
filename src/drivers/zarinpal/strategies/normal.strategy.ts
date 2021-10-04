import { IReceipt } from '../../../receipt';
import { ZarinpalStrategy } from '../zarinpal';

export class ZarinpalNormalStrategy implements ZarinpalStrategy {
  links = {
    PURCHASE: 'https://ir.zarinpal.com/pg/services/WebGate/wsdl',
    PAYMENT: 'https://www.zarinpal.com/pg/StartPay/',
    VERIFICATION: 'https://ir.zarinpal.com/pg/services/WebGate/wsdl',
  };

  async purchase(): Promise<string> {
    fetch(this.links.PURCHASE, {
      headers: {
        'CONTENT-Type': 'application/json',
      },
    });
    throw new Error('Method not implemented.');
  }

  pay(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  verify(): Promise<IReceipt> {
    throw new Error('Method not implemented.');
  }
}

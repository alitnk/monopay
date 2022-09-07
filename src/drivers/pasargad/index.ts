import axios from 'axios';
import { Driver } from 'driver';
import { VerificationException } from 'exceptions';
import { LinksObject } from 'types';
import * as API from './api';
export class Pasargad extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.tConfig);
  }
  protected links: LinksObject = API.links;
  requestPayment = async (options: API.RequestOptions) => {
    return this.makeRequestInfo(12, 'GET', this.getLinks().PAYMENT, { n: '' });
  };
  verifyPayment = async (_options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    const { amount, invoiceDate, invoiceNumber, TransactionReferenceID } = params;
    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
      this.getLinks().VERIFICATION,
      {
        Amount: amount,
        InvoiceDate: invoiceDate,
        InvoiceNumber: invoiceNumber,
        Timestamp: this.getCurrentTimestamp(),
        TerminalCode: this.config.terminalId,
        MerchantCode: this.config.merchantId,
      },
      {
        headers: {},
      },
    );
    if (!response.data?.IsSuccess) throw new VerificationException('عملیات با خطا مواجه شد');
    return {
      raw: response.data,
      transactionId: TransactionReferenceID,
      cardPan: response.data.MaskedCardNumber,
    };
  };

  private getCurrentTimestamp = (): string => {
    const currentDateISO = new Date().toISOString();
    return currentDateISO.replace(/-/g, '/').replace('T', ' ').replace('Z', '').split('.')[0];
  };
}

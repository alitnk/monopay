import axios from 'axios';
import * as soap from 'soap';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export class Saman extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.tConfig);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.tRequestOptions);

    const { amount, callbackUrl, mobile, wage } = options;
    const { merchantId } = this.config;
    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(this.getLinks().REQUEST, {
      Amount: amount,
      RedirectURL: callbackUrl,
      CellNumber: mobile,
      TerminalId: merchantId,
      Action: 'token',
      Wage: wage,
    });

    if (response.data.status !== 1 && response.data.errorCode !== undefined) {
      throw new RequestException(API.purchaseErrors[response.data.errorCode.toString()]);
    }

    if (!response.data.token) {
      throw new RequestException();
    }

    return this.makeRequestInfo(response.data.token, 'POST', this.getLinks().PAYMENT, {
      Token: response.data.token,
      GetMethod: true,
    });
  };

  verifyPayment = async (_options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    const { RefNum: referenceId, TraceNo: transactionId, Status: status } = params;
    const { merchantId } = this.config;
    if (!referenceId) {
      throw new PaymentException(API.purchaseErrors[status.toString()]);
    }

    const soapClient = await soap.createClientAsync(this.getLinks().VERIFICATION);

    const responseStatus = +(await soapClient.verifyTransaction(referenceId, merchantId));

    if (responseStatus < 0) {
      throw new VerificationException(API.purchaseErrors[responseStatus]);
    }

    return {
      transactionId: +transactionId,
      cardPan: params.SecurePan,
      raw: params,
    };
  };
}

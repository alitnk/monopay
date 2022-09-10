import axios from 'axios';
import { Driver } from '../../driver';
import { PaymentException, RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

export class Payir extends Driver<API.Config> {
  constructor(config: API.Config) {
    super(config, API.configSchema);
  }

  protected links = API.links;

  requestPayment = async (options: API.RequestOptions) => {
    options = this.getParsedData(options, API.requestSchema);

    const { amount, callbackUrl, description, mobile, nationalCode, validCardNumber } = options;

    const response = await axios.post<API.RequestPaymentReq, { data: API.RequestPaymentRes }>(this.getLinks().REQUEST, {
      api: this.getApiKey(),
      amount,
      redirect: callbackUrl,
      description,
      mobile,
      nationalCode,
      validCardNumber,
    });

    const { status } = response.data;

    if (status.toString() !== '1') {
      throw new RequestException(API.errors[status.toString()]);
    }

    response.data = response.data as API.RequestPaymentRes_Success;

    return this.makeRequestInfo(response.data.token, 'GET', this.getLinks().PAYMENT + response.data.token);
  };

  verifyPayment = async (_options: API.VerifyOptions, params: API.CallbackParams): Promise<API.Receipt> => {
    const { status, token } = params;

    if (status.toString() !== '1') {
      throw new PaymentException(API.errors[status.toString()]);
    }

    const response = await axios.post<API.VerifyPaymentReq, { data: API.VerifyPaymentRes }>(
      this.getLinks().VERIFICATION,
      {
        api: this.getApiKey(),
        token,
      },
    );

    const verifyStatus = response.data.status;

    if (verifyStatus.toString() !== '1') {
      throw new VerificationException(API.errors[verifyStatus.toString()]);
    }

    response.data = response.data as API.VerifyPaymentRes_Success;

    return {
      raw: response.data,
      transactionId: response.data.transId,
      cardPan: response.data.cardNumber,
    };
  };

  protected getApiKey() {
    return this.config.sandbox ? 'test' : this.config.apiKey;
  }
}

import { LinksObject, PaymentReceipt } from './types';
import { PaymentInfo } from './payment-info';
import { str as crc32Encode } from 'crc-32';
import { v4 as uuidv4 } from 'uuid';

export abstract class Driver<Config = any> {
  constructor(protected config: Config) {}

  setConfig(config: Config) {
    this.config = config;
  }

  protected abstract links: LinksObject;

  protected linkStrategy = 'default';

  protected setLinkStrategy(strategy: string) {
    this.linkStrategy = strategy;
  }

  protected getLinks() {
    return this.links[this.linkStrategy];
  }

  abstract requestPayment: (requestOptions: any) => Promise<PaymentInfo>;

  abstract verifyPayment: (verifyOptions: any, requestParams: any) => Promise<PaymentReceipt>;

  protected makeRequestInfo = (
    referenceId: ConstructorParameters<typeof PaymentInfo>[0],
    method: ConstructorParameters<typeof PaymentInfo>[1],
    url: ConstructorParameters<typeof PaymentInfo>[2],
    params: ConstructorParameters<typeof PaymentInfo>[3] = {}
  ) => new PaymentInfo(referenceId, method, url, params);

  protected generateUuid() {
    return uuidv4();
  }

  protected generateId() {
    return crc32Encode(this.generateUuid());
  }
}

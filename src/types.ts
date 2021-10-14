import * as t from 'io-ts';

export const tBaseRequestOptions = t.intersection([
  t.interface({
    callbackUrl: t.string,
    amount: t.number,
  }),
  t.partial({
    description: t.string,
  }),
]);
export type BaseRequestOptions = t.TypeOf<typeof tBaseRequestOptions>;

export const tBaseVerifyOptions = t.interface({
  amount: t.number,
});

export type BaseVerifyOptions = t.Type<typeof tBaseVerifyOptions>;

export interface BaseReceipt<RawReceipt = any> {
  transactionId: string | number;
  cardPan?: string;
  raw: RawReceipt;
}

export interface PaymentInfo {
  method: 'GET' | 'POST';
  url: string;
  params: Record<string, any>;
}

export type ErrorList = Record<string, string>;

export type LinksObject = Record<
  string,
  {
    REQUEST: string;
    VERIFICATION: string;
    PAYMENT: string;
  }
>;

interface BaseOptions {
  amount: number;
}

export interface RequestOptions extends BaseOptions {
  callbackUrl: string;
  description?: string;
}

export interface VerifyOptions extends BaseOptions {}

export interface Receipt {
  transactionId: string | number;
  cardPan?: string;
  raw: any;
}

export interface PaymentInfo {
  method: 'GET' | 'POST';
  url: string;
  params: Record<string, any>;
}

export type ErrorList = Record<string, string>;
export type LinksObject = Record<string, {
  REQUEST: string,
  VERIFICATION: string,
  PAYMENT: string,
}>

export interface PaymentRequestOptions {
  callbackUrl: string;
  amount: number;
  description?: string;
}

export interface PaymentVerifyOptions {
  amount: number;
}

export interface PaymentReceipt {
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

export type LinksObject = Record<
  string,
  {
    REQUEST: string;
    VERIFICATION: string;
    PAYMENT: string;
  }
>;

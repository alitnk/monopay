interface BaseOptions {
  amount: number;
}

export interface PurchaseOptions extends BaseOptions {
  callbackUrl: string;
  description?: string;
}

export interface VerifyOptions extends BaseOptions {}

export interface Receipt {
  transactionId: string | number;
  cardPan?: string;
  raw: any;
}

export interface PurchaseInfo {
  method: 'GET' | 'POST';
  url: string;
  params: Record<string, any>;
}

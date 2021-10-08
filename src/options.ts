interface BaseOptions {
  amount: number;
}

export interface PurchaseOptions extends BaseOptions {
  callbackUrl: string;
  description?: string;
}

export interface VerifyOptions extends BaseOptions {
  code: string;
}

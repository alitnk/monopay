export interface Invoice {
  amount: number;
  callbackUrl: string;
  merchantId: string;
  description?: string;
}

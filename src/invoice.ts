export interface Invoice {
  amount: number;
  callbackUrl: string;
  merchant: string;
  description?: string;
}

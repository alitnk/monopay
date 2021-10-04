import { Invoice } from '../../invoice';

export interface ZarinpalInvoice extends Invoice {
  mobile: string;
  email: string;
}

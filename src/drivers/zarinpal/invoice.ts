import { Invoice } from '../../invoice';

export interface ZarinpalInvoice extends Invoice {
  metadata: {
    mobile: string;
    email: string;
  };
}

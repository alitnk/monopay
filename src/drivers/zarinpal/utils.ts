import { zarinpalLinks } from './api';

export function getZarinpalLinks(sandbox = false) {
  return zarinpalLinks[sandbox ? 'sandbox' : 'default'];
}

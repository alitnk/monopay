import { links } from './api';

export function getZarinpalLinks(sandbox = false) {
  return links[sandbox ? 'sandbox' : 'default'];
}

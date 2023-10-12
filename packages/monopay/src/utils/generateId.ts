import { str as crc32Encode } from 'crc-32';
import { generateUuid } from './generateUuid';

export const generateId = () => {
  return crc32Encode(generateUuid());
};

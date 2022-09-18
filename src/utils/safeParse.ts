import { BadConfigError } from '../exceptions';
import { ZodSchema } from 'zod';

export const safeParse = <T>(parser: ZodSchema, data: T): T => {
  const parsed = parser.safeParse(data);
  if (parsed.success) return parsed.data;
  const message = parsed.error.errors.map((err) => `${err.path[0]}: ${err.message}`).join('\n');
  throw new BadConfigError({ message, isIPGError: false });
};

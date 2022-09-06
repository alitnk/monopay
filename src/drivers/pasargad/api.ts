import * as t from 'io-ts';

export const tConfig = t.interface({
  merchantId: t.string,
  terminalId: t.string,
});

export type Config = t.TypeOf<typeof tConfig>;

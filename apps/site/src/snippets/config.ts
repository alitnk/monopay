const configTs = `import { ConfigObject } from "monopay";

export const monopayConfig: ConfigObject = {
  zarinpal: {
    merchantId: "zarinpal-merchant",
    sandbox: true,
  },
  zibal: {
    merchantId: "zibal-merchant",
    sandbox: true,
  },
};
`

const configJs = `/** @type {import("monopay").ConfigObject} */
export const monopayConfig = {
    zarinpal: {
        merchantId: "zarinpal-merchant",
        sandbox: true,
    },
    zibal: {
        merchantId: "zibal-merchant",
        sandbox: true,
    }
}
`

export const configSnippets = {
  ts: configTs,
  js: configJs,
}

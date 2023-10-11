const requestTs = `import { getPaymentDriver } from "monopay";

const driver = getPaymentDriver("zarinpal", {
  merchantId: "zarinpal-merchant",
});

const paymentInfo = await driver.requestPayment({
  amount: 50000,
  callbackUrl: "https://my-site.com/callback",
  description: "Description about the transaction",
});
`

const requestJs = `import { getPaymentDriver } from "monopay";

const driver = getPaymentDriver("zarinpal", {
  merchantId: "zarinpal-merchant",
});

const paymentInfo = await driver.requestPayment({
  amount: 50000,
  callbackUrl: "https://my-site.com/callback",
  description: "Description about the transaction",
});
`

export const requestSnippets = {
  ts: requestTs,
  js: requestJs,
}
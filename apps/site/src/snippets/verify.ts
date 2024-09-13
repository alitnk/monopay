const verifyTs = `import { getPaymentDriver } from "monopay";

const driver = getPaymentDriver("zarinpal")({
  merchantId: "zarinpal-merchant",
});

const receipt = await driver.verifyPayment(
  {
    amount: 5000,
  },
  { ...request.params, ...request.body }
);
`

const verifyJs = `import { getPaymentDriver } from "monopay";

const driver = getPaymentDriver("zarinpal")({
  merchantId: "zarinpal-merchant",
});

const receipt = await driver.verifyPayment(
  {
    amount: 5000,
  },
  { ...request.params, ...request.body }
);
`

export const verifySnippets = {
  ts: verifyTs,
  js: verifyJs,
}
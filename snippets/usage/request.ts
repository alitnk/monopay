import { getPaymentDriver } from "monopay";

const driver = getPaymentDriver<"zarinpal">("zarinpal")({
  merchantId: "zarinpal-merchant",
});

const paymentInfo = await driver.request({
  amount: 50000,
  callbackUrl: "https://my-site.com/callback",
  description: "Description about the transaction",
});

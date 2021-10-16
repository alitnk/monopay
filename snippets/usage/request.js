import { getPaymentDriver } from "polypay";

const driver = getPaymentDriver("zarinpal", {
  merchantId: "zarinpal-merchant",
});

const paymentInfo = await driver.requestPayment({
  amount: 50000,
  callbackUrl: "https://my-site.com/callback",
  description: "Description about the transaction",
});
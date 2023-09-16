import { getPaymentDriver } from "monopay";

const driver = getPaymentDriver("zarinpal", {
  merchantId: "zarinpal-merchant",
});

const receipt = await driver.verifyPayment(
  {
    amount: 5000,
  },
  { ...request.params, ...request.body }
);

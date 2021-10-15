import { getPaymentDriver } from "polypay";

const driver = getPaymentDriver("zarinpal", {
  merchantId: "zarinpal-merchant",
});

const receipt = await driver.verifyPayment(
  {
    amount: 5000,
    referenceId: 1234,
  },
  { ...request.params, ...request.body }
);

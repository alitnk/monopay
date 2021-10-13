import { getPaymentDriver, Zarinpal } from "polypay";

const driver = getPaymentDriver<Zarinpal>("zarinpal", {
  merchantId: "zarinpal-merchant",
});

const receipt = await driver.verifyPayment(
  {
    amount: 5000,
    referenceId: 1234,
  },
  request.params()
);

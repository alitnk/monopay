import { zarinpal } from "polypay.js";

const receipt = await zarinpal.verify(
  {
    amount: 5000,
    merchantId: "some-id-you-got-from-the-service",
  },
  request
);
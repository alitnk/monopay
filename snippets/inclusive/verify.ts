import { getPaymentDriver } from "polypay.js";
import { polypayConfig } from "./polypay-config";

const driver = getPaymentDriver(polypayConfig, userPreferedService);
const receipt = await driver.verify(
  {
    amount: 5000,
  },
  request
);
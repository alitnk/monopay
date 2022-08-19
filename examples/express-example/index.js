require('dotenv').config();
const express = require('express');
const { getPaymentDriver } = require('monopay');

const app = express();
app.use(express.urlencoded({ extended: true }));
const port = 3000;

/**
 * A mock database for storing a payment
 */
const db = {
  paymentID,
  amount,
};

/** @type {import('monopay').ConfigObject} */
const monopayConfiguration = {
  zibal: {
    merchantId: 'your-merchant-id',
    sandbox: true,
  },
  zarinpal: {
    merchantId: 'your-merchant-id',
    sandbox: true,
  },
  sadad: {
    merchantId: 'your-merchant-id',
    terminalId: 'your-terminal-id',
    terminalKey: 'your-terminal-key',
  },
  payir: {
    apiKey: 'your-api-key',
    sandbox: true,
  },
  nextpay: {
    apiKey: 'your-api-key',
  },
};

/** @type {import('monopay').DriverName} */
const chosenDriver = 'nextpay';

/**
 * The purchase route that will redirect the user to the payment gateway
 */
app.get('/purchase', async (req, res) => {
  try {
    const driver = getPaymentDriver(chosenDriver, monopayConfiguration[chosenDriver]);

    const paymentInfo = await driver.requestPayment({
      amount: 20000,
      callbackUrl: process.env.APP_URL + '/callback',
    });

    // Save the payment info in database
    db.paymentID = paymentInfo.referenceId;
    db.amount = 2000;

    res.send(`<html>
        <body>
            <h1> We're redirecting you to the payment gateway... </h1>
            <script>${paymentInfo.getScript()}</script>
        </body>
        </html>`);
  } catch (e) {
    console.log(e.message);
  }
});

/**
 * The callback URL that was given to `requestPayment`
 */
app.all('/callback', async (req, res) => {
  try {
    const driver = getPaymentDriver(chosenDriver, monopayConfiguration[chosenDriver]);

    const receipt = await driver.verifyPayment(
      {
        amount: db.amount, // from database
        referenceId: db.paymentID, // from database
      },
      { ...req.query, ...req.body },
    ); // support both GET and POST

    res.json({
      referenceId: receipt.referenceId, // Is probably null if you're using sandbox
      success: true,
    });
  } catch (e) {
    console.log(e.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

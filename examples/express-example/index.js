require('dotenv').config()
const express = require('express')
const { getPaymentDriver } = require('polypay')

const app = express()
app.use(express.urlencoded({
    extended: true
}));
const port = 3000

/** @type {import('polypay').ConfigObject} */
const polypayConfiguration = {
    zarinpal: {
        merchantId: 'your-merchant-id',
        sandbox: true,
    },
    zibal: {
        merchantId: 'your-merchant-id',
        sandbox: true,
    },
    sadad: {
        merchantId: 'your-merchant-id',
        terminalId: 'your-terminal-id',
        terminalKey: 'your-terminal-key'
    }
}

/**
 * The purchase route that will redirect the user to the payment gateway
 */
app.get('/purchase', async (req, res) => {
    const driver = getPaymentDriver('zibal', polypayConfiguration.zibal);

    const paymentInfo = await driver.requestPayment({
        amount: 20000,
        callbackUrl: process.env.APP_URL + '/callback',
    })

    // Store the payment info in a database //

    res.send(`<html>
        <body>
            <h1> We're redirecting you to the payment gateway... </h1>
            <script>${paymentInfo.getScript()}</script>
        </body>
        </html>`)

})

/**
 * The callback URL that was given to `purchase` 
 */
app.all('/callback', async (req, res) => {
    const driver = getPaymentDriver('zibal', polypayConfiguration.zibal)

    // Get the payment info from database //

    const receipt = await driver.verifyPayment({
        amount: 2000, // from database
        referenceId: 1234 // from database
    }, { ...req.query, ...req.body }); // support both GET and POST

    res.json({
        referenceId: receipt.referenceId,
        success: true,
    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

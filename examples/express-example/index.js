require('dotenv').config()
const express = require('express')
const { zibal, getScript, PaymentException, VerificationException, getPaymentDriver } = require('polypay')

const app = express()
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
    if (!Object.keys(polypayConfiguration).includes(req.params.preferedDriver)) {
        throw Error("We don't use that payment service.")
    }

    const paymentInfo = await getPaymentDriver(req.params.preferedDriver, polypayConfiguration)
        .request({
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
    const driver = 'zibal'; // In a real scenario, the user might decide this

    // Get the payment info from database //

    const payLink = await getPaymentDriver(driver, polypayConfiguration).verify({
        amount: 2000, // from database
        referenceId: 1234 // from database
    }, req);

    console.log(receipt)

    res.json({
        referenceId: receipt.referenceId,
        success: true,
    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

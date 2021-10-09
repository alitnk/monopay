require('dotenv').config()
const express = require('express')
const { zibal, getScript, PaymentException, VerificationException, getPaymentDriver } = require('polypay.js')

const app = express()
const port = 3000

/** @type {import('polypay.js').ConfigObject} */
const polypayConfiguration = {
    zarinpal: {
        merchantId: 'zarinpal-merchant',
        sandbox: true,
    },
    zibal: {
        merchantId: 'zibal-merchant',
        sandbox: true,
    }
}

/**
 * The purchase route that will redirect the user to the payment gateway
 */
app.get('/purchase', async (req, res) => {
    const driver = 'zibal'; // In a real scenario, the user might decide this

    try {
        const payLink = await getPaymentDriver(driver, polypayConfiguration).request({
            amount: 20000,
            callbackUrl: process.env.APP_URL + '/callback',
        })

        res.send(`
        <html>
        <body>
            <h1> We're redirecting you to the payment gateway... </h1>
            <script>${getScript(paymentInfo)}</script>
        </body>
        </html>
        `)
    } catch (error) {
        console.log(error)
        if (typeof error === PaymentException) {
            res.send({
                error: error.userFriendlyMessage
            })
        }
    }
})

/**
 * The callback URL that was given to `purchase` 
 */
app.get('/callback', async (req, res) => {
    const driver = 'zibal'; // In a real scenario, the user might decide this

    try {
        const payLink = await getPaymentDriver(driver, polypayConfiguration).verify({
            amount: 2000,
        }, req);

        console.log(receipt)

        res.json({
            referenceId: receipt.referenceId, // Will be null since it's sandbox
            success: true,
        })
    } catch (error) {
        console.log(error)
        if (typeof error === VerificationException) {
            res.send({
                error: error.userFriendlyMessage
            })
        }
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

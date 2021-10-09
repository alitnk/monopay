require('dotenv').config()
const express = require('express')
const { zibal, getScript, PaymentException, VerificationException } = require('polypay.js')

const app = express()
const port = 3000

/**
 * The purchase route that will redirect the user to the payment gateway
 */
app.get('/purchase', async (req, res) => {
    try {
        const purchaseInfo = await zibal.purchase({
            amount: 20000,
            merchantId: '1234',
            callbackUrl: process.env.APP_URL + '/callback',
            sandbox: true,
        }, { sandbox: true })

        res.send(`
        <html>
        <body>
            <h1> We're redirecting you to the payment gatewayh1>
            <script>${getScript(purchaseInfo)}</script>
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
    try {
        const receipt = (await zibal.verify({
            amount: 2000,
            merchantId: '1234',
            sandbox: true
        }, req))

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

const express = require('express')
require('dotenv').config()
const { zibal, PaymentException, VerificationException } = require('polypay.js')
const app = express()
const port = 3000

app.get('/purchase', async (req, res) => {
    try {
        const payLink = await zibal.purchase({
            amount: 20000,
            merchant: '1234',
            callbackUrl: process.env.APP_URL + '/callback',
        }, { strategy: 'sandbox' })

        res.redirect(payLink)
    } catch (error) {
        console.log(error)
        if (typeof error === PaymentException) {
            res.send({
                error: error.userFriendlyMessage
            })
        }
    }
})

app.get('/callback', async (req, res) => {
    try {
        const receipt = (await zibal.verify({ amount: 2000, merchant: '1234' }, req, { strategy: 'sandbox' }))
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
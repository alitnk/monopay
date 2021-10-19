![polypay.js](https://github.com/alitnk/polypay.js/raw/graphics/github-readme-logo.png)

# polypay - پُلی‌پِی
![Intended Runtime Environment: Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![NPM Version](https://img.shields.io/npm/v/polypay?style=for-the-badge)
![NPM Downloads](https://img.shields.io/npm/dm/polypay?style=for-the-badge)
![License](https://img.shields.io/npm/l/polypay?style=for-the-badge)
![Last Comit](https://img.shields.io/github/last-commit/alitnk/polypay.js?style=for-the-badge)


A node.js package for making payment transactions with different Iranian IPGs with one single API.

> در صورتی که از پکیج خوشتون اومده، بهش استار بدید تا بیشتر دیده بشه و مشکلاتش زودتر برطرف بشن. 🙏

## 📖 Documentation

- [Documentation](https://alitnk.github.io/polypay.js/)
- [مستندات فارسی](https://alitnk.github.io/polypay.js/fa/)

## 🔌 Installation

For npm users:
```shell
npm install polypay

```

For yarn users:
```shell
yarn add polypay
```

## 🚀 Usage

- [Usage Guide](https://alitnk.github.io/polypay.js/docs/usage/request-payment)
- [نحوه استفاده به فارسی](https://alitnk.github.io/polypay.js/fa/docs/usage/request-payment)

## ⚒ Examples

### Getting a payment driver

```javascript
const driver = getPaymentDriver('zibal', {
  merchantId: 'merchant-id',
  sandbox: true,
});
```

### Requesting for payment

```javascript
const paymentInfo = await driver.requestPayment({
    amount: 200000, // IRR
    callbackUrl: 'mysite.com/callback',
});
```

### Verifying the payment in callback
```javascript
app.all('/callback', async (req, res) => {
  const receipt = await driver.verifyPayment({
      amount: 200000, // IRR
      referenceId: 1234,
  }, { ...req.query, ...req.body }); 

  res.json({
      referenceId: receipt.referenceId,
      success: true,
      message: 'The payment transaction was successful.',
  })
})
```
A full example with express can be found [here](examples/express-example)

## 🤝 Contribution

Please read [Contribution](CONTRIBUTING.md) and [Code Of Conduct](CODE_OF_CONDUCT.md).

## 📝 License

MIT License - Please see [License File](License) for more information.

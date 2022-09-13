# Example using Express

Switch to [persian (فارسی)](/examples/express-example/READMEfa.md)

There are two routes in this example:

1. `/purchase`: requests the payment and then sends the user to the payment gateway
2. `/callback`: receives the data from the gateway and verifies it

> Note: in order to test this example with SSL, you can use [ngrok.com](https://ngrok.com) and add your ngrok url to the `.env` file.

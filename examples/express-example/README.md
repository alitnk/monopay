# Example using Express and JavaScript

We have two routes in this example:

1. `/purchase`: requests the payment and then sends the user to the payment gateway
2. `/callback`: receives the data from the gateway and verifies it

To test using this example with SSL, you can use ngrok.com and add your ngrok url to the `.env` file.

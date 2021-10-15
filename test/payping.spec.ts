import axios from 'axios';
import { PayPing } from '../src/drivers/payping';
import * as API from '../src/drivers/payping/api';
import { RequestException } from '../src/exceptions';
import { getPaymentDriver } from '../src/drivers';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('PayPing Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      code: '1234',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<PayPing>('payping', { apiKey: '2134' });

    expect(
      typeof (await driver.requestPayment({ callbackUrl: 'https://path.to/callback-url', amount: 20000 })).url
    ).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    // mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } });
    mockedAxios.post.mockReturnValueOnce(Promise.reject({ response: { status: 401 } }));

    const driver = getPaymentDriver<PayPing>('payping', { apiKey: '2134' });

    await expect(async () => await driver.requestPayment({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(
      RequestException
    );
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      amount: 40000,
      cardHashPan: 'hash',
      cardNumber: '1234-****-****-1234',
    };
    const expectedResult: API.Receipt = { transactionId: '1234', raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<PayPing>('payping', { apiKey: '2134' });

    expect(
      (
        await driver.verifyPayment(
          { amount: 2000 },
          {
            code: '1234',
            cardhashpan: 'hash',
            clientrefid: 'clientrefid',
            cardnumber: '1234-****-****-1234',
            refid: '1234',
          }
        )
      ).transactionId
    ).toEqual(expectedResult.transactionId);
  });
});

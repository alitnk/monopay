import axios from 'axios';
import { Zibal } from '../src/drivers/zibal';
import * as API from '../src/drivers/zibal/api';
import { RequestException } from '../src/exceptions';
import { getPaymentDriver } from '../src/drivers';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Zibal Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.PurchaseResponse = {
      message: 'hello',
      result: 100,
      trackId: 1234,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Zibal>('zibal', { merchantId: '2134' });

    expect(typeof (await driver.requestPayment({ callbackUrl: 'https://google.com', amount: 20000 })).url).toBe(
      'string'
    );
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.PurchaseResponse = {
      result: 102,
      message: 'some error',
      trackId: 1234,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Zibal>('zibal', { merchantId: '2134' });

    await expect(async () => await driver.requestPayment({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(
      RequestException
    );
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyResponse = {
      paidAt: '2018-03-25T23:43:01.053000',
      amount: 1600,
      result: 100,
      status: 1,
      refNumber: 1234,
      description: 'Hello World!',
      cardNumber: '62741****44',
      orderId: '2211',
      message: 'success',
    };
    const expectedResult: API.Receipt = { transactionId: 1234, raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Zibal>('zibal', { merchantId: '2134' });

    expect(
      (await driver.verifyPayment({ amount: 2000 }, { query: { trackId: '12345', status: '1', success: '1' } }))
        .transactionId
    ).toEqual(expectedResult.transactionId);
  });
});

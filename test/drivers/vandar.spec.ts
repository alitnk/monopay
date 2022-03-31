import axios from 'axios';
import { getPaymentDriver } from '../../src/drivers';
import { Vandar } from '../../src/drivers/vandar';
import * as API from '../../src/drivers/vandar/api';
import { RequestException } from '../../src/exceptions';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Vandar Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      status: 1,
      token: '123',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Vandar>('vandar', { api_key: '1234' });

    expect(typeof (await driver.requestPayment({ amount: 2000, callbackUrl: 'asd' })).url).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      status: 0,
      errors: ['A', 'B'],
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Vandar>('vandar', { api_key: '2134' });

    await expect(
      async () => await driver.requestPayment({ amount: 2000, callbackUrl: 'https://example.com' })
    ).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      status: 1,
      transId: 201,
      errors: [],
    };
    const expectedResult: API.Receipt = { transactionId: 201, raw: serverResponse as any };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Vandar>('vandar', { api_key: '2134' });

    expect((await driver.verifyPayment({ amount: 2000 }, { token: '2000', payment_status: 'OK' })).transactionId).toBe(
      expectedResult.transactionId
    );
  });
});

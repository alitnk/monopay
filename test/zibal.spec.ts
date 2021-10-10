import axios from 'axios';
import { request, verify } from '../src/drivers/zibal';
import * as API from '../src/drivers/zibal/api';
import { ZibalReceipt } from '../src/drivers/zibal/types';
import { RequestException } from '../src/exception';

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

    expect(typeof (await request({ merchantId: '2134', callbackUrl: 'https://google.com', amount: 20000 })).url).toBe(
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

    await expect(
      async () => await request({ amount: 2000, callbackUrl: 'asd', merchantId: '123123123' })
    ).rejects.toThrow(RequestException);
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
    const expectedResult: ZibalReceipt = { transactionId: 1234, raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      (
        await verify(
          { amount: 2000, merchantId: '123123123' },
          { query: { trackId: '12345', status: '1', success: '1' } }
        )
      ).transactionId
    ).toEqual(expectedResult.transactionId);
  });
});
import axios from 'axios';
import { purchase, verify, verifyManually } from '../src/drivers/zibal';
import { ZibalPurchaseResponse, ZibalVerifyResponse } from '../src/drivers/zibal/api';
import { ZibalReceipt } from '../src/drivers/zibal/types';
import { PaymentException } from '../src/exception';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Zibal Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: ZibalPurchaseResponse = {
      message: 'hello',
      payLink: 'somelinkto.pay/1234',
      result: 100,
      trackId: 1234,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(await purchase({ merchantId: '2134', callbackUrl: 'https://google.com', amount: 20000 })).toBe(
      serverResponse.payLink
    );
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: ZibalPurchaseResponse = {
      result: 102,
      message: 'some error',
      trackId: 1234,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(
      async () => await purchase({ amount: 2000, callbackUrl: 'asd', merchantId: '123123123' })
    ).rejects.toThrow(PaymentException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: ZibalVerifyResponse = {
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
    const expectedResult: ZibalReceipt = { referenceId: 1234, raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      await verify(
        { amount: 2000, merchantId: '123123123' },
        { query: { trackId: '12345', status: '1', success: '1' } }
      )
    ).toEqual(expectedResult);

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(await verifyManually({ amount: 2000, merchantId: '123123123', code: '2000' })).toEqual(expectedResult);
  });
});

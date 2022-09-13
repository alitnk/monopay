import axios from 'axios';
import { Receipt } from '../../driver';
import { RequestException } from '../../exceptions';
import * as API from './api';
import { createZibalDriver, ZibalDriver } from './zibal';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Zibal Driver', () => {
  let driver: ZibalDriver;

  beforeAll(() => {
    driver = createZibalDriver({
      merchantId: '1234',
    });
  });

  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      message: 'hello',
      result: 100,
      trackId: 1234,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(typeof (await driver.request({ callbackUrl: 'https://path.to/callback-url', amount: 20000 })).url).toBe(
      'string',
    );
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      result: 102,
      message: 'some error',
      trackId: 1234,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
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
    const expectedResult: Receipt = { transactionId: 1234, raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      (await driver.verify({ amount: 2000 }, { trackId: '12345', status: '1', success: '1' })).transactionId,
    ).toEqual(expectedResult.transactionId);
  });
});

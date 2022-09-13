import axios from 'axios';
import { BaseReceipt } from '../../driver';
import { getPaymentDriver } from '../../drivers';
import { RequestException } from '../../exceptions';
import * as API from './api';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Payir Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      status: 1,
      token: '1234',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('payir')({ apiKey: '2134' });

    expect(typeof (await driver.request({ callbackUrl: 'https://path.to/callback-url', amount: 20000 })).url).toBe(
      'string',
    );
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      status: 2,
      errorMessage: 'some error',
      token: '1234',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('payir')({ apiKey: '2134' });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      status: 1,
      amount: 'مبلغ تراکنش',
      transId: '1234',
      factorNumber: 'شماره فاکتور',
      mobile: 'شماره موبایل',
      description: 'توضیحات',
      cardNumber: 'شماره کارت',
      message: 'OK',
    };
    const expectedResult: BaseReceipt = { transactionId: '1234', raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('payir')({ apiKey: '2134' });

    expect((await driver.verify({ amount: 2000 }, { token: '12345', status: '1' })).transactionId).toEqual(
      expectedResult.transactionId,
    );
  });
});
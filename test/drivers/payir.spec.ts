import axios from 'axios';
import { getPaymentDriver } from '../../src/drivers';
import { Payir } from '../../src/drivers/payir';
import * as API from '../../src/drivers/payir/api';
import { RequestException } from '../../src/exceptions';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Payir Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      status: 1,
      token: '1234',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Payir>('payir', { apiKey: '2134' });

    expect(
      typeof (await driver.requestPayment({ callbackUrl: 'https://path.to/callback-url', amount: 20000 })).url,
    ).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      status: 2,
      errorMessage: 'some error',
      token: '1234',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Payir>('payir', { apiKey: '2134' });

    await expect(async () => await driver.requestPayment({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(
      RequestException,
    );
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
    const expectedResult: API.Receipt = { transactionId: '1234', raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Payir>('payir', { apiKey: '2134' });

    expect((await driver.verifyPayment({ amount: 2000 }, { token: '12345', status: '1' })).transactionId).toEqual(
      expectedResult.transactionId,
    );
  });
});

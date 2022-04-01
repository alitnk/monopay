import axios from 'axios';
import { getPaymentDriver } from '../../src/drivers';
import { IdPay } from '../../src/drivers/idpay';
import * as API from '../../src/drivers/idpay/api';
import { RequestException } from '../../src/exceptions';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('IdPay Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      id: '123',
      link: 'https://somelink.com/',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<IdPay>('idpay', { apiKey: '2134' });

    expect(
      typeof (await driver.requestPayment({ callbackUrl: 'https://path.to/callback-url', amount: 20000 })).url,
    ).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      error_code: 100,
      error_message: 'Some error happened',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<IdPay>('idpay', { apiKey: '2134' });

    await expect(async () => await driver.requestPayment({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(
      RequestException,
    );
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      status: 200,
      date: new Date().toString(),
      order_id: '321',
      id: '123',
      track_id: 1234,
      amount: 20000,
      verify: {
        date: new Date().toString(),
      },
      payment: {
        amount: 20000,
        card_no: '1234-****-***-1234',
        date: new Date().toString(),
        hashed_card_no: 'hash',
        track_id: '1234',
      },
    };
    const expectedResult: API.Receipt = { transactionId: 1234, raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<IdPay>('idpay', { apiKey: '2134' });

    expect(
      (await driver.verifyPayment({ amount: 2000 }, { status: '200', track_id: '1234', id: '123', order_id: '321' }))
        .transactionId,
    ).toEqual(expectedResult.transactionId);
  });
});

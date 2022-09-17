import axios from 'axios';
import { Receipt } from '../../driver';
import { BadConfigError, RequestException, UserError } from '../../exceptions';
import * as API from './api';
import { createIdpayDriver, IdpayDriver } from './idpay';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('IdPay Driver', () => {
  let driver: IdpayDriver;

  beforeAll(() => {
    driver = createIdpayDriver({ apiKey: '2134' });
  });

  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      id: '123',
      link: 'https://somelink.com/',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(typeof (await driver.request({ callbackUrl: 'https://path.to/callback-url', amount: 20000 })).url).toBe(
      'string',
    );
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      error_code: 100,
      error_message: 'Some error happened',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(RequestException);
  });

  it('throws payment bad config error accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      error_code: 23,
      error_message: 'Some error happened',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(BadConfigError);
  });

  it('throws payment user error accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      error_code: 7,
      error_message: 'Some error happened',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(UserError);
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
    const expectedResult: Receipt = { transactionId: 1234, raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      (await driver.verify({ amount: 2000 }, { status: '200', track_id: '1234', id: '123', order_id: '321' }))
        .transactionId,
    ).toEqual(expectedResult.transactionId);
  });
});

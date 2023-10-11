import axios from 'axios';
import { Receipt } from '../../driver';
import { BadConfigError, GatewayFailureError, UserError } from '../../exceptions';
import * as API from './api';
import { createNextpayDriver, NextpayDriver } from './nextpay';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('NextPay Driver', () => {
  let driver: NextpayDriver;

  beforeAll(() => {
    driver = createNextpayDriver({ apiKey: '1234' });
  });

  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      code: 0,
      trans_id: '1234',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(typeof (await driver.request({ callbackUrl: 'https://path.to/callback-url', amount: 20000 })).url).toBe(
      'string',
    );
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      trans_id: '1234',
      code: 1,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(GatewayFailureError);
  });

  it('throws payment bad config errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      trans_id: '1234',
      code: -61,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(BadConfigError);
  });

  it('throws payment user errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      trans_id: '1234',
      code: -4,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(UserError);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      Shaparak_Ref_Id: '123123123',
      amount: 20000,
      card_holder: '1234',
      code: 0,
      order_id: '1234',
      custom: {},
    };
    const expectedResult: Receipt = { transactionId: '123123123', raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      (await driver.verify({ amount: 2000 }, { trans_id: '12345', order_id: '1234', amount: 20000 })).transactionId,
    ).toEqual(expectedResult.transactionId);
  });
});

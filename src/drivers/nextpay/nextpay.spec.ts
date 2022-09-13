import axios from 'axios';
import { BaseReceipt } from '../../driver';
import { getPaymentDriver } from '../../drivers';
import { RequestException } from '../../exceptions';
import * as API from './api';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('NextPay Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      code: 0,
      trans_id: '1234',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('nextpay')({ apiKey: '1234' });

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

    const driver = getPaymentDriver('nextpay')({ apiKey: '1234' });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(RequestException);
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
    const expectedResult: BaseReceipt = { transactionId: '123123123', raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('nextpay')({ apiKey: '1234' });

    expect(
      (await driver.verify({ amount: 2000 }, { trans_id: '12345', order_id: '1234', amount: 20000 })).transactionId,
    ).toEqual(expectedResult.transactionId);
  });
});

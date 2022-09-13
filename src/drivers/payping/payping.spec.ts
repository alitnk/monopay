import axios from 'axios';
import { BaseReceipt } from '../../driver';
import { getPaymentDriver } from '../../drivers';
import { RequestException } from '../../exceptions';
import * as API from './api';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('PayPing Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      code: '1234',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('payping')({ apiKey: '2134' });

    const res = await driver.request({ callbackUrl: 'https://path.to/callback-url', amount: 20000 });
    expect(typeof res.url).toBe('string');
  });

  it('throws payment errors accordingly', () => {
    // mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } });
    mockedAxios.post.mockReturnValueOnce(Promise.reject({ response: { status: 401 } }));

    const driver = getPaymentDriver('payping')({ apiKey: '2134' });

    expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      amount: 40000,
      cardHashPan: 'hash',
      cardNumber: '1234-****-****-1234',
    };
    const expectedResult: BaseReceipt = { transactionId: '1234', raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('payping')({ apiKey: '2134' });

    const res = await driver.verify(
      { amount: 2000 },
      {
        code: '1234',
        cardhashpan: 'hash',
        clientrefid: 'clientrefid',
        cardnumber: '1234-****-****-1234',
        refid: '1234',
      },
    );

    expect(res.transactionId).toEqual(expectedResult.transactionId);
  });
});

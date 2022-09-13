import axios from 'axios';
import { Receipt } from '../../driver';
import { RequestException } from '../../exceptions';
import * as API from './api';
import { createPaypingDriver, PaypingDriver } from './payping';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('PayPing Driver', () => {
  let driver: PaypingDriver;

  beforeAll(() => {
    driver = createPaypingDriver({
      apiKey: '1234',
    });
  });

  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      code: '1234',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const res = await driver.request({ callbackUrl: 'https://path.to/callback-url', amount: 20000 });
    expect(typeof res.url).toBe('string');
  });

  it('throws payment errors accordingly', () => {
    // mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } });
    mockedAxios.post.mockReturnValueOnce(Promise.reject({ response: { status: 401 } }));

    expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      amount: 40000,
      cardHashPan: 'hash',
      cardNumber: '1234-****-****-1234',
    };
    const expectedResult: Receipt = { transactionId: '1234', raw: serverResponse };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

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

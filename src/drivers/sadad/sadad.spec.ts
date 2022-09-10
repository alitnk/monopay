import axios from 'axios';
import { getPaymentDriver } from '../../drivers';
import { RequestException } from '../../exceptions';
import * as API from './api';
import { Sadad } from './sadad';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Sadad Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      Token: 'some-token',
      ResCode: 0,
      Description: 'description',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Sadad>('sadad', {
      merchantId: 'asd',
      terminalKey: 'NTkwNDQ3M2NhM2RhOTRkMWM5MWFhMjcw',
      terminalId: 'H3AHMXaS',
    });

    expect(
      typeof (
        await driver.requestPayment({
          amount: 20000,
          callbackUrl: 'https://callback.url/',
          mobile: '09120000000',
        })
      ).url,
    ).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      Token: 'some-token',
      ResCode: 3,
      Description: 'description',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Sadad>('sadad', {
      merchantId: 'asd',
      terminalKey: 'NTkwNDQ3M2NhM2RhOTRkMWM5MWFhMjcw',
      terminalId: 'H3AHMXaS',
    });

    await expect(
      async () =>
        await driver.requestPayment({
          amount: 20000,
          callbackUrl: 'https://callback.url/',
          mobile: '09120000000',
        }),
    ).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      Amount: 10000,
      OrderId: 123123,
      Description: 'description',
      ResCode: 0,
      RetrivalRefNo: '1234',
      SystemTraceNo: '4321',
    };
    const callbackParams: API.CallbackParams = {
      HashedCardNo: '1111-****-****-1111',
      OrderId: 123123,
      PrimaryAccNo: '123',
      ResCode: 0,
      Token: 'token',
      SwitchResCode: '',
    };
    const expectedResult: API.Receipt = { transactionId: '4321', raw: callbackParams };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Sadad>('sadad', {
      merchantId: 'asd',
      terminalKey: 'NTkwNDQ3M2NhM2RhOTRkMWM5MWFhMjcw',
      terminalId: 'H3AHMXaS',
    });

    expect((await driver.verifyPayment({ amount: 10000 }, callbackParams)).transactionId).toBe(
      expectedResult.transactionId,
    );
  });
});

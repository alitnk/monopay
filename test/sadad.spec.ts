import axios from 'axios';
import { request, verify } from '../src/drivers/sadad';
import * as API from '../src/drivers/sadad/api';
import { SadadReceipt } from '../src/drivers/sadad/types';
import { RequestException } from '../src/exception';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Sadad Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.PurchaseResponse = {
      Token: 'some-token',
      ResCode: 0,
      Description: 'description',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      typeof (
        await request({
          merchantId: 'asd',
          terminalKey: 'NTkwNDQ3M2NhM2RhOTRkMWM5MWFhMjcw',
          terminalId: 'H3AHMXaS',
          amount: 20000,
          callbackUrl: 'https://callback.url/',
          mobile: '09120000000',
        })
      ).url
    ).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.PurchaseResponse = {
      Token: 'some-token',
      ResCode: 3,
      Description: 'description',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(
      async () =>
        await request({
          merchantId: 'asd',
          terminalKey: 'NTkwNDQ3M2NhM2RhOTRkMWM5MWFhMjcw',
          terminalId: 'H3AHMXaS',
          amount: 20000,
          callbackUrl: 'https://callback.url/',
          mobile: '09120000000',
        })
    ).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyResponse = {
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
    const expectedResult: SadadReceipt = { transactionId: '4321', raw: callbackParams };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      (
        await verify(
          {
            amount: 10000,
            terminalId: 'H3AHMXaS',
            terminalKey: 'NTkwNDQ3M2NhM2RhOTRkMWM5MWFhMjcw',
            merchantId: '123213',
          },
          { query: callbackParams }
        )
      ).transactionId
    ).toBe(expectedResult.transactionId);
  });
});

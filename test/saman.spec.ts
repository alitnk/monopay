import axios from 'axios';
import { request, verify } from '../src/drivers/saman';
import { SamanCallbackParams, SamanPurchaseResponse, SamanVerifyResponse } from '../src/drivers/saman/api';
import { SamanReceipt } from '../src/drivers/saman/types';
import { PaymentException } from '../src/exception';

jest.mock('axios');
const mockSoapClient: any = {};
jest.mock('soap', () => ({
  createClientAsync: async () => mockSoapClient,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
// const mockedSoap = soap as jest.Mocked<typeof soap>;
describe('Saman Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: SamanPurchaseResponse = {
      token: '123',
      status: 1,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      typeof (
        await request({
          merchantId: '1234',
          amount: 20000,
          callbackUrl: 'https://mysite.com/callback',
          mobile: '09120000000',
        })
      ).url
    ).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: SamanPurchaseResponse = {
      errorCode: 2,
      status: -1,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(
      async () =>
        await request({
          merchantId: '1234',
          amount: 20000,
          callbackUrl: 'https://mysite.com/callback',
          mobile: '09120000000',
        })
    ).rejects.toThrow(PaymentException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: SamanVerifyResponse = 10000;
    const callbackParams: SamanCallbackParams = {
      Amount: '10000',
      MID: '1234',
      RRN: '12345',
      RefNum: '123456',
      ResNum: '1234567',
      SecurePan: '1234-****-****-1234',
      State: 'Success',
      Status: '1',
      TerminalId: '1234',
      TraceNo: '111111',
    };
    const expectedResult: SamanReceipt = { transactionId: 111111, raw: callbackParams };

    mockSoapClient.verifyTransaction = () => serverResponse;

    expect(
      await (await verify({ amount: 2000, merchantId: '123123123' }, { query: callbackParams })).transactionId
    ).toBe(expectedResult.transactionId);
  });
});

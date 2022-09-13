import { BaseReceipt } from '../../driver';
import { RequestException } from '../../exceptions';
import * as API from './api';
import { createParsianDriver, ParsianDriver } from './parsian';

const mockSoapClient: any = {};
jest.mock('soap', () => ({
  createClientAsync: async () => mockSoapClient,
}));

describe('Parsian Driver', () => {
  let driver: ParsianDriver;

  beforeAll(() => {
    driver = createParsianDriver({ merchantId: 'merchant-id' });
  });

  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      Token: 123,
      Status: 0,
    };

    mockSoapClient.SalePaymentRequest = () => serverResponse;

    expect(
      typeof (
        await driver.request({
          amount: 20000,
          callbackUrl: 'https://mysite.com/callback',
        })
      ).url,
    ).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      Status: 1,
    };

    mockSoapClient.SalePaymentRequest = () => serverResponse;

    await expect(
      async () =>
        await driver.request({
          amount: 20000,
          callbackUrl: 'https://mysite.com/callback',
        }),
    ).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      RRN: 123456789,
      CardNumberMasked: '1234-****-****-1234',
      Status: 0,
      Token: 12345,
    };
    const callbackParams: API.CallbackParams = {
      Amount: 20000,
      HashCardNumber: 'hashed-card',
      OrderId: 1234,
      RRN: 123456789,
      TerminalNo: 22,
      Token: 12345,
      status: 0,
    };

    const expectedResult: BaseReceipt = { transactionId: 123456789, raw: serverResponse };

    mockSoapClient.ConfirmPayment = () => serverResponse;
    mockSoapClient.ReversalRequest = () => serverResponse;

    expect(await (await driver.verify({ amount: 2000 }, callbackParams)).transactionId).toBe(
      expectedResult.transactionId,
    );
  });
});

import { getPaymentDriver } from '../../src/drivers';
import { Parsian } from '../../src/drivers/parsian';
import * as API from '../../src/drivers/parsian/api';
import { RequestException } from '../../src/exceptions';

const mockSoapClient: any = {};
jest.mock('soap', () => ({
  createClientAsync: async () => mockSoapClient,
}));

// const mockedSoap = soap as jest.Mocked<typeof soap>;
describe('Parsian Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      SalePaymentRequestResult: {
        Token: 123,
        Status: 0,
        Message: 'ok',
      },
    };

    mockSoapClient.SalePaymentRequestAsync = async () => [serverResponse];

    const driver = getPaymentDriver<Parsian>('parsian', {
      merchantId: 'merchant-id',
    });

    expect(
      typeof (
        await driver.requestPayment({
          amount: 20000,
          callbackUrl: 'https://mysite.com/callback',
        })
      ).url,
    ).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      SalePaymentRequestResult: {
        Status: 1,
        Message: 'nok',
      },
    };

    mockSoapClient.SalePaymentRequestAsync = async () => [serverResponse];

    const driver = getPaymentDriver<Parsian>('parsian', {
      merchantId: 'merchant-id',
    });

    await expect(
      async () =>
        await driver.requestPayment({
          amount: 20000,
          callbackUrl: 'https://mysite.com/callback',
        }),
    ).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      ConfirmPaymentResult: {
        RRN: 123456789,
        CardNumberMasked: '1234-****-****-1234',
        Status: 0,
        Token: 12345,
      },
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

    const expectedResult: API.Receipt = { transactionId: 123456789, raw: serverResponse };

    mockSoapClient.ConfirmPaymentAsync = async () => [serverResponse];

    const driver = getPaymentDriver<Parsian>('parsian', {
      merchantId: 'merchant-id',
    });

    expect(await (await driver.verifyPayment({ amount: 2000 }, callbackParams)).transactionId).toBe(
      expectedResult.transactionId,
    );
  });
});

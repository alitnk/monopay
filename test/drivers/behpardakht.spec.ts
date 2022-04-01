import { getPaymentDriver } from '../../src/drivers';
import { Behpardakht } from '../../src/drivers/behpardakht';
import * as API from '../../src/drivers/behpardakht/api';
import { RequestException } from '../../src/exceptions';

const mockSoapClient: any = {};
jest.mock('soap', () => ({
  createClientAsync: async () => mockSoapClient,
}));

// const mockedSoap = soap as jest.Mocked<typeof soap>;
describe('Behpardakht Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = '0, some-hash-from-api';

    mockSoapClient.bpPayRequest = () => serverResponse;

    const driver = getPaymentDriver<Behpardakht>('behpardakht', {
      terminalId: 1234,
      username: 'username',
      password: 'password',
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
    const serverResponse: API.RequestPaymentRes = '100';

    mockSoapClient.bpPayRequest = () => serverResponse;

    const driver = getPaymentDriver<Behpardakht>('behpardakht', {
      terminalId: 1234,
      username: 'username',
      password: 'password',
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
    const serverResponse: API.VerifyPaymentRes = '0';
    const callbackParams: API.CallbackParams = {
      CardHolderPan: '1234-****-****-1234',
      RefId: '111111',
      ResCode: '0',
      SaleReferenceId: 1234,
      saleOrderId: 4321,
    };

    const expectedResult: API.Receipt = { transactionId: '111111', raw: callbackParams };

    mockSoapClient.bpVerifyRequest = () => serverResponse;
    mockSoapClient.bpSettleRequest = () => serverResponse;

    const driver = getPaymentDriver<Behpardakht>('behpardakht', {
      terminalId: 1234,
      username: 'username',
      password: 'password',
    });

    expect(await (await driver.verifyPayment({ amount: 2000 }, callbackParams)).transactionId).toBe(
      expectedResult.transactionId,
    );
  });
});

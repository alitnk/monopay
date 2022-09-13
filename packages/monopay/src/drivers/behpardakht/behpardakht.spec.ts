import { Receipt } from '../../driver';
import { RequestException } from '../../exceptions';
import * as API from './api';
import { BehpardakhtDriver, createBehpardakhtDriver } from './behpardakht';

const mockSoapClient: any = {};
jest.mock('soap', () => ({
  createClientAsync: async () => mockSoapClient,
}));

describe('Behpardakht Driver', () => {
  let driver: BehpardakhtDriver;

  beforeAll(() => {
    driver = createBehpardakhtDriver({
      terminalId: 1234,
      username: 'username',
      password: 'password',
    });
  });

  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = '0, some-hash-from-api';

    mockSoapClient.bpPayRequest = () => serverResponse;

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
    const serverResponse: API.RequestPaymentRes = '100';

    mockSoapClient.bpPayRequest = () => serverResponse;

    await expect(
      async () =>
        await driver.request({
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

    const expectedResult: Receipt = { transactionId: '111111', raw: callbackParams };

    mockSoapClient.bpVerifyRequest = () => serverResponse;
    mockSoapClient.bpSettleRequest = () => serverResponse;

    expect(await (await driver.verify({ amount: 2000 }, callbackParams)).transactionId).toBe(
      expectedResult.transactionId,
    );
  });
});

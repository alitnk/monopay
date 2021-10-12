import axios from 'axios';
import { Zarinpal } from '../src/drivers/zarinpal';
import * as API from '../src/drivers/zarinpal/api';
import { RequestException } from '../src/exceptions';
import { getPaymentDriver } from '../src/inclusive';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Zarinpal Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.PurchaseResponse = {
      data: { authority: '10', code: 100, fee: 20000, message: 'ok', fee_type: 'Merchant' },
      errors: [],
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Zarinpal>('zarinpal', { merchantId: '2134' });

    expect(typeof (await driver.requestPayment({ amount: 2000, callbackUrl: 'asd' })).url).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.PurchaseResponse = {
      data: [],
      errors: { code: -11, message: 'Some error happened from zarinpal', validations: [] },
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Zarinpal>('zarinpal', { merchantId: '2134' });

    await expect(async () => await driver.requestPayment({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(
      RequestException
    );
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyResponse = {
      data: {
        code: 100,
        message: 'Verified',
        card_hash: '1EBE3EBEBE35C7EC0F8D6EE4F2F859107A87822CA179BC9528767EA7B5489B69',
        card_pan: '502229******5995',
        ref_id: 201,
        fee_type: 'Merchant',
        fee: 2000,
      },
      errors: [],
    };
    const expectedResult: API.Receipt = { transactionId: 201, raw: serverResponse.data as any };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Zarinpal>('zarinpal', { merchantId: '2134' });

    expect(
      (await driver.verifyPayment({ amount: 2000 }, { query: { Authority: '2000', Status: 'OK' } })).transactionId
    ).toBe(expectedResult.transactionId);
  });
});

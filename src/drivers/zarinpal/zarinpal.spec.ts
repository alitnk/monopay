import axios from 'axios';
import { BaseReceipt } from '../../driver';
import { getPaymentDriver } from '../../drivers';
import { RequestException } from '../../exceptions';
import * as API from './api';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Zarinpal Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: API.RequestPaymentRes = {
      data: { authority: '10', code: 100, fee: 20000, message: 'ok', fee_type: 'Merchant' },
      errors: [],
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('zarinpal')({ merchantId: '2134' });

    expect(typeof (await driver.request({ amount: 2000, callbackUrl: 'asd' })).url).toBe('string');
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: API.RequestPaymentRes = {
      data: [],
      errors: { code: -11, message: 'Some error happened from zarinpal', validations: [] },
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('zarinpal')({ merchantId: '2134' });

    await expect(driver.request({ amount: 2000, callbackUrl: 'asd' })).rejects.toThrow(RequestException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
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
    const expectedResult: BaseReceipt = { transactionId: 201, raw: serverResponse.data as any };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('zarinpal')({ merchantId: '2134' });

    expect((await driver.verify({ amount: 2000 }, { Authority: '2000', Status: 'OK' })).transactionId).toBe(
      expectedResult.transactionId,
    );
  });
});

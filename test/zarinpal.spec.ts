import axios from 'axios';
import { purchase, verify, verifyManually } from '../src/drivers/zarinpal';
import { ZarinpalPurchaseResponse, ZarinpalVerifyResponse } from '../src/drivers/zarinpal/api';
import { ZarinpalReceipt } from '../src/drivers/zarinpal/types';
import { PaymentException } from '../src/exception';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Zarinpal Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: ZarinpalPurchaseResponse = {
      data: { authority: '10', code: 100, fee: 20000, message: 'ok', fee_type: 'Merchant' },
      errors: [],
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(await purchase({ amount: 2000, callbackUrl: 'asd', merchant: '123123123' })).toBe(
      'https://www.zarinpal.com/pg/StartPay/10'
    );
  });

  it('throws payment errors accordingly', async () => {
    const serverResponse: ZarinpalPurchaseResponse = {
      data: [],
      errors: { code: -11, message: 'Some error happened from zarinpal', validations: [] },
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    await expect(
      async () => await purchase({ amount: 2000, callbackUrl: 'asd', merchant: '123123123' })
    ).rejects.toThrow(PaymentException);
  });

  it('verifies the purchase correctly', async () => {
    const serverResponse: ZarinpalVerifyResponse = {
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
    const expectedResult: ZarinpalReceipt = { referenceId: 201, raw: serverResponse.data as any };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      await verify({ amount: 2000, merchant: '123123123' }, { query: { authority: '2000', status: 'OK' } })
    ).toEqual(expectedResult);

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(await verifyManually({ amount: 2000, merchant: '123123123', code: '2000' })).toEqual(expectedResult);
  });
});

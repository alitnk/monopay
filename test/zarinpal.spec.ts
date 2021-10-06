import axios from 'axios';
import { purchase, verify } from '../src/drivers/zarinpal';
import { ZarinpalPurchaseResponse } from '../src/drivers/zarinpal/purchase';
import { ZarinpalVerifyResponse } from '../src/drivers/zarinpal/verify';
import { PaymentException } from '../src/exception';
import { Receipt } from '../src/receipt';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Zarinpal Driver', () => {
  it('returns the correct payment url', async () => {
    const serverResponse: ZarinpalPurchaseResponse = {
      data: { authority: '10', code: 100, fee: 20000, message: 'ok', fee_type: 'Merchant' },
      errors: [],
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(await purchase({ amount: 2000, callbackUrl: 'asd', merchantId: '123123123' })).toBe(
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
      async () => await purchase({ amount: 2000, callbackUrl: 'asd', merchantId: '123123123' })
    ).rejects.toThrow(PaymentException);
  });

  it('verifies the purchase correctly', async () => {
    const expectedResult: Receipt = { fee: 2000, referenceId: 201 };
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

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(
      await verify({ amount: 2000, merchantId: '123123123' }, { params: { authority: '2000', status: 'OK' } })
    ).toBe(expectedResult);

    // verifyManually: await verifyManually({ amount: 2000, merchantId: '123123123', authority: '2000' }),
    // expect(sum(1, 1)).toEqual(2);
  });
});

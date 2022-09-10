import axios from 'axios';
import * as crypto from 'crypto';
import { getPaymentDriver } from '../../drivers';
import { RequestException, VerificationException } from '../../exceptions';
import * as API from './api';
import { Pasargad } from './pasargad';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedKeyPair = crypto.generateKeyPairSync('rsa', {
  modulusLength: 1024,
});
const mockedPemKey = mockedKeyPair.privateKey.export({
  format: 'pem',
  type: 'pkcs8',
}) as string;

describe('Pasargad', () => {
  it('returns the correct payment url', async () => {
    const getTokenResponse = {
      IsSuccess: true,
      Message: 'عملیات با موفقیت انجام شد',
      Token: 'PAYMENT_TOKEN',
    };
    mockedAxios.post.mockResolvedValueOnce({ data: getTokenResponse });
    const driver = getPaymentDriver<Pasargad>('pasargad', {
      privateKey: mockedPemKey,
      merchantId: '123',
      terminalId: '123',
    });
    expect(
      typeof (
        await driver.requestPayment({
          amount: 2000,
          callbackUrl: 'https://test.com/callback',
          invoiceDate: new Date().toISOString(),
          invoiceNumber: '12',
          email: 'someone@something.some', // optional property
          mobile: '09100000000',
        })
      ).url,
    ).toBe('string');
  });
  it('throws payment errors accordingly', async () => {
    const getTokenResponse = {
      IsSuccess: false,
      Message: 'تراکنش ارسالی معتبر نیست',
    };
    mockedAxios.post.mockResolvedValueOnce({ data: getTokenResponse });
    const driver = getPaymentDriver<Pasargad>('pasargad', {
      privateKey: mockedPemKey,
      merchantId: '123',
      terminalId: '123',
    });
    await expect(
      async () =>
        await driver.requestPayment({
          amount: 2000,
          callbackUrl: 'https://tets.com',
          invoiceDate: new Date().toISOString(),
          invoiceNumber: '12',
        }),
    ).rejects.toThrow(RequestException);
  });
  it('verifies the purchase correctly', async () => {
    const serverResponse: API.VerifyPaymentRes = {
      IsSuccess: true,
      HashedCardNumber:
        '2DDB1E270C598677AE328AA37C2970E3075E1DB6665C5AAFD131C59F7FAD99F23680536B07C140D24AAD8355EA9725A5493AC48E0F48E39D50B54DB906958182',
      MaskedCardNumber: '5022-29**-****-2328',
      Message: 'عملیات با موفقیت انجام شد',
      ShaparakRefNumber: '100200300400500',
    };
    const expectedResult: API.Receipt = {
      transactionId: '123456',
      raw: serverResponse,
      cardPan: serverResponse.MaskedCardNumber,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver<Pasargad>('pasargad', {
      privateKey: mockedPemKey,
      merchantId: '123',
      terminalId: '123',
    });

    expect(
      await driver.verifyPayment({ amount: 2000 }, { iD: new Date().toISOString(), iN: '123', tref: '123456' }),
    ).toStrictEqual(expectedResult);
  });

  it('throws verification errors accordingly', async () => {
    const verifyPaymentResponse = {
      IsSuccess: false,
      Message: 'تراکنش ارسالی معتبر نیست',
    };
    mockedAxios.post.mockResolvedValueOnce({ data: verifyPaymentResponse });
    const driver = getPaymentDriver<Pasargad>('pasargad', {
      privateKey: mockedPemKey,
      merchantId: '123',
      terminalId: '123',
    });
    await expect(
      async () =>
        await driver.verifyPayment({ amount: 2000 }, { iD: new Date().toISOString(), iN: '123', tref: '1234' }),
    ).rejects.toThrow(VerificationException);
  });
});

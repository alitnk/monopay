import axios from 'axios';
import * as fs from 'fs/promises';
import { BaseReceipt } from '../../driver';
import { getPaymentDriver } from '../../drivers';
import { RequestException, VerificationException } from '../../exceptions';
import * as API from './api';

jest.mock('axios');
jest.mock('fs/promises');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedFs = fs as jest.Mocked<typeof fs>;
const mockKey = `<RSAKeyValue>
<Modulus>n2qWKhU63oMvcp3eVVLFtrnZjZdOzgjvqeogl/ruXCaMAVd7hrJQpYpcEt37P15spDCiyVR3OE8wjLaDDb8PktrxvovZ8t126vrN3xDuxUdt0MrBx5yYfwNCqRnc2DGKi+SiQgj3TjIZ1rF6R7ia/WNYJVbutp2+ORzYtufCkgE=</Modulus>
<Exponent>AQAB</Exponent>
<P>rhWXibYPWhZ6ekpb/8UWSt5eY1Z8sx+XDDNiEYFYplgmOi9jwAf5h/88W0ywduBjiMr8Ov9v7IPIzyYBLyzhGw==</P>
<Q>6m4SMV9fcvE95Wcwzn32gM+71Lbl4gQVkz4gXjjB8IDynAqE8WVnVzEFwS6+XXNv4pW+xf7rzjtm73G2NFRnEw==</Q>
<DP>pjgXqXYc0ngEGiBGF8Gnt3T7yv4Zsy7Gmu+1A+HtM2eXmJcHN6RlrmUWzFY9aER4xXSLwgmEZOCwLJqtJs5DYQ==</DP>
<DQ>Ilm8mrVx5ALLYgjr0uYML7XAvRuLtcGJc8jfr067xETwx8KW1lRYfyM0x6jUxha7J0Vv7c07uj1kCOPtod9YNw==</DQ>
<InverseQ>XV7UhJDUxqFDaS6uMpXA64tlvsfvFWlVqO1fRsOC/Gv90xLoqYEL4PUe9y4dmtfwmubb50egak7okmwCgljYHw==</InverseQ>
<D>io7Xyef97NzU5qg0ULDKzBEo+BolEotN0799aNtfRZTzZ08kPGTMF7X0ZSmvcNqfTu4+7wKNRNH/fq47pj0ESNsWVt1FkQu/upp6uTzdiFF2xjcouA8NCLhdV1/VJjtINJq3M8AUT8Qa5VvDTbzL5bxyvWfIqxZVWU0k7XGEVak=</D>
</RSAKeyValue>`;

mockedFs.readFile.mockResolvedValue(Buffer.from(mockKey));

describe('Pasargad', () => {
  it('returns the correct payment url', async () => {
    const getTokenResponse = {
      IsSuccess: true,
      Message: 'عملیات با موفقیت انجام شد',
      Token: 'PAYMENT_TOKEN',
    };
    mockedAxios.post.mockResolvedValueOnce({ data: getTokenResponse });
    const driver = getPaymentDriver('pasargad')({
      privateKeyXMLFile: './something.xml',
      merchantId: '123',
      terminalId: '123',
    });
    expect(
      typeof (
        await driver.request({
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
    const driver = getPaymentDriver('pasargad')({
      privateKeyXMLFile: './something.xml',
      merchantId: '123',
      terminalId: '123',
    });
    await expect(
      async () =>
        await driver.request({
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
    const expectedResult: BaseReceipt = {
      transactionId: '123456',
      raw: serverResponse,
      cardPan: serverResponse.MaskedCardNumber,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    const driver = getPaymentDriver('pasargad')({
      privateKeyXMLFile: './something.xml',
      merchantId: '123',
      terminalId: '123',
    });

    expect(
      await driver.verify({ amount: 2000 }, { iD: new Date().toISOString(), iN: '123', tref: '123456' }),
    ).toStrictEqual(expectedResult);
  });

  it('throws verification errors accordingly', async () => {
    const verifyResponse = {
      IsSuccess: false,
      Message: 'تراکنش ارسالی معتبر نیست',
    };
    mockedAxios.post.mockResolvedValueOnce({ data: verifyResponse });
    const driver = getPaymentDriver('pasargad')({
      privateKeyXMLFile: './something.xml',
      merchantId: '123',
      terminalId: '123',
    });
    await expect(
      driver.verify({ amount: 2000 }, { iD: new Date().toISOString(), iN: '123', tref: '1234' }),
    ).rejects.toThrow(VerificationException);
  });
});

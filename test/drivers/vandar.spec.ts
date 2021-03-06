import axios from 'axios';
import { PaymentException, VerificationException } from '../../src/';
import { getPaymentDriver } from '../../src/drivers';
import { Vandar } from '../../src/drivers/vandar';
import * as API from '../../src/drivers/vandar/api';
import { RequestException } from '../../src/exceptions';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Vandar Driver', () => {
  let driver: Vandar;

  beforeAll(() => {
    driver = getPaymentDriver('vandar', { api_key: '123' });
  });

  it('should get the driver', async () => {
    const driver = getPaymentDriver('vandar', { api_key: '123' });
    expect(driver).toBeInstanceOf(Vandar);
  });

  it('should return the correct payment URL', async () => {
    const serverResponse: API.RequestPaymentRes = {
      status: 1,
      token: '123',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(driver.requestPayment({ amount: 2000, callbackUrl: 'asd' })).resolves.toMatchObject({
      method: 'GET',
      params: {},
      referenceId: '123',
      url: 'https://ipg.vandar.io/v3/123',
    });
  });

  it('should throw payment error', async () => {
    const serverResponse: API.RequestPaymentRes = {
      status: 0,
      errors: ['A', 'B'],
    };

    mockedAxios.post.mockResolvedValueOnce({ data: serverResponse });

    expect(driver.requestPayment({ amount: 2000, callbackUrl: 'https://example.com' })).rejects.toThrow(
      RequestException,
    );
  });

  it('should verify the purchase', async () => {
    const providerResponse: API.VerifyPaymentRes = {
      status: 1,
      transId: 201,
    };

    const payment_status = 'OK';
    const token = '123';
    const amount = 2000;

    const expectedResult: API.Receipt = {
      transactionId: 201,
      raw: {
        payment_status,
        token,
      },
    };

    mockedAxios.post.mockResolvedValueOnce({ data: providerResponse });

    expect(driver.verifyPayment({ amount }, { token, payment_status })).resolves.toMatchObject(expectedResult);
  });

  it('should throw payment error when payment_status is not OK', async () => {
    const providerResponse: API.VerifyPaymentRes = {
      status: 0,
      errors: ['A', 'B'],
    };

    mockedAxios.post.mockResolvedValueOnce({ data: providerResponse });

    const token = '2000';
    const payment_status = 'NOK'; // Not documented!
    const amount = 2000;

    expect(driver.verifyPayment({ amount }, { token, payment_status })).rejects.toThrow(PaymentException);
  });

  it('should throw payment error', async () => {
    const providerResponse: API.VerifyPaymentRes = {
      status: 0,
      errors: ['A', 'B'],
    };

    mockedAxios.post.mockResolvedValueOnce({ data: providerResponse });

    const token = '2000';
    const payment_status = 'OK';
    const amount = 2000;

    expect(driver.verifyPayment({ amount }, { token, payment_status })).rejects.toThrow(VerificationException);
  });
});

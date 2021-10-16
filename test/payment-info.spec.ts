import { PaymentInfo } from '../src/payment-info';

describe('Payment Info Class', () => {
  it('has certain fields on it', () => {
    const paymentInfo = new PaymentInfo(123, 'GET', 'https://url.go/', { test: '1' });
    expect(paymentInfo.url).toBe('https://url.go/');
    expect(paymentInfo.referenceId).toBe(123);
    expect(paymentInfo.method).toBe('GET');
    expect(paymentInfo.params.test).toBe('1');
  });

  it('creates javascript raw script for form submiting', () => {
    const paymentInfo = new PaymentInfo(123, 'GET', 'https://url.go/', { test: '1' });
    expect(typeof paymentInfo.getScript()).toBe('string');
    expect(paymentInfo.getScript()).toContain('.submit()');
  });
});

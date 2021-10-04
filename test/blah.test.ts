import { Zarinpal } from '../src/drivers/zarinpal/driver';
describe('blah', () => {
  it('works', () => {
    const result = new Zarinpal({
      amount: 2000,
      callbackUrl: 'https://google.com',
      description: 'asd',
      merchantId: '1234-1234-1234-1234',
      metadata: {
        email: 'ali@gmail.com',
        mobile: '09382922780',
      },
    }).pay();
    console.log(result);
    // expect(sum(1, 1)).toEqual(2);
  });
});

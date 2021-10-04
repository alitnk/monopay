import { Zarinpal } from './drivers/zarinpal/driver';
async function main() {
  const zp = new Zarinpal({
    amount: 2000,
    callbackUrl: 'https://google.com',
    description: 'asd',
    merchantId: '1234-1234-1234-1234',
    email: 'ali@gmail.com',
    mobile: '09382922780',
  });

  console.log(await zp.purchase());
}

main();

export * from './driver';
export * from './receipt';
export * from './invoice';

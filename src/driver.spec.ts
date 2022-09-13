import { z } from 'zod';
import { defineDriver } from './driver';

const createTestDriver = defineDriver({
  schema: {
    config: z.object({}),
    request: z.object({}),
    verify: z.object({}),
  },
  defaultConfig: {},
  request: async () => {
    return {
      method: 'GET',
      referenceId: 420,
      url: 'https://fake.url/',
      params: { test: 1 },
    };
  },
  verify: async () => {
    return {
      raw: {},
      transactionId: 1,
      cardPan: '1234-****-****-1234',
    };
  },
});

describe('Driver', () => {
  it('creates javascript raw script for form submission on request()', async () => {
    const driver = createTestDriver({});
    const paymentInfo = await driver.request({
      amount: 1000,
      callbackUrl: 'https://callback.url/',
      description: 'testin',
    });

    expect(typeof paymentInfo.getScript()).toBe('string');
    expect(paymentInfo.getScript()).toContain('.submit()');
  });
});

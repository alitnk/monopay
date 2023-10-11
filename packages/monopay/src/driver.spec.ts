/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadConfigError } from './exceptions';
import { z } from 'zod';
import { defineDriver } from './driver';

const createTestDriver = defineDriver({
  schema: {
    config: z.object({ test: z.string() }),
    request: z.object({ test: z.string() }),
    verify: z.object({ test: z.string() }),
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
    const driver = createTestDriver({ test: 'test' });
    const paymentInfo = await driver.request({
      test: 'test',
      amount: 1000,
      callbackUrl: 'https://callback.url/',
      description: 'testin',
    });

    expect(typeof paymentInfo.getScript()).toBe('string');
    expect(paymentInfo.getScript()).toContain('.submit()');
  });
  it('Throws badConfigError when wrong config is passed', () => {
    // error is expected here
    // @ts-expect-error
    expect(() => createTestDriver({})).toThrow(BadConfigError);
  });
  it('Throws badConfigError when wrong request params are passed', async () => {
    const driver = createTestDriver({ test: 'test' });
    await expect(
      async () =>
        // error is expected here
        // @ts-expect-error
        await driver.request({
          amount: 1000,
          callbackUrl: 'https://callback.url/',
          description: 'testin',
        }),
    ).rejects.toThrow(BadConfigError);
  });
  it('Throws badConfigError when wrong verify params are passed', async () => {
    const driver = createTestDriver({ test: 'test' });
    await expect(
      async () =>
        // error is expected here
        // @ts-expect-error
        await driver.verify({
          amount: 1000,
          callbackUrl: 'https://callback.url/',
          description: 'testin',
        }),
    ).rejects.toThrow(BadConfigError);
  });
});

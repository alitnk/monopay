import { MonopayService } from './monopay.service';

describe('MonopayService', () => {
  let monopayService: MonopayService;

  beforeEach(() => {
    monopayService = new MonopayService({
      zibal: {
        merchantId: 'asd',
      },
    });
  });

  describe('getDriver', () => {
    it('returns the driver if config is provided for the driver', async () => {
      expect(typeof monopayService.getDriver('zibal')).toBe('object');
      expect(monopayService.getDriver('zibal').request).toBeDefined();
      expect(monopayService.getDriver('zibal').verify).toBeDefined();
    });

    it('it should throw error if config is not provided for the driver', async () => {
      expect(() => monopayService.getDriver('zarinpal')).toThrowError();
    });
  });
});

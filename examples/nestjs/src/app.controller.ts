import { Body, Controller, Get, Query } from '@nestjs/common';
import { MonopayService } from 'monopay';

@Controller()
export class AppController {
  constructor(private readonly monopay: MonopayService) {}

  @Get('/purchase')
  async purchase(): Promise<string> {
    const paymentInfo = await this.monopay.getDriver('zibal').request({
      amount: 10000,
      callbackUrl: process.env.APP_URL + '/callback',
    });

    return paymentInfo.getScript();
  }

  @Get('/callback')
  async callback(@Query() query: any, @Body() body: any): Promise<string> {
    const receipt = await this.monopay.getDriver('zibal').verify(
      {
        amount: 10000,
      },
      { ...query, ...body },
    );

    return receipt.transactionId.toString();
  }
}

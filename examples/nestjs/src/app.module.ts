import { Module } from '@nestjs/common';
import { MonopayModule } from 'monopay';
import { AppController } from './app.controller';

@Module({
  imports: [
    MonopayModule.register({
      zibal: {
        merchantId: 'your-merchant-id',
        sandbox: true,
      },
      zarinpal: {
        merchantId: 'your-merchant-id',
        sandbox: true,
      },
      sadad: {
        merchantId: 'your-merchant-id',
        terminalId: 'your-terminal-id',
        terminalKey: 'your-terminal-key',
      },
      payir: {
        apiKey: 'your-api-key',
        sandbox: true,
      },
      nextpay: {
        apiKey: 'your-api-key',
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MonopayModuleAsyncOptions, MonopayModuleOptions, MonopayModuleOptionsFactory } from './interfaces';
import { MONOPAY_OPTIONS } from './monopay.constants';
import { MonopayService } from './monopay.service';

@Module({
  providers: [MonopayService],
  exports: [MonopayService],
})
export class MonopayModule {
  static register(config: MonopayModuleOptions): DynamicModule {
    return {
      module: MonopayModule,
      providers: [
        {
          provide: MONOPAY_OPTIONS,
          useValue: config,
        },
      ],
    };
  }

  static registerAsync(options: MonopayModuleAsyncOptions): DynamicModule {
    return {
      module: MonopayModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), ...(options.extraProviders || [])],
    };
  }

  private static createAsyncProviders(options: MonopayModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const providers = [this.createAsyncOptionsProvider(options)];
    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }
    return providers;
  }

  private static createAsyncOptionsProvider(options: MonopayModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: MONOPAY_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const provider: Provider = {
      provide: MONOPAY_OPTIONS,
      useFactory: async (optionsFactory: MonopayModuleOptionsFactory) => optionsFactory.createMonopayOptions(),
    };
    if (options.useExisting) provider.inject = [options.useExisting];
    if (options.useClass) provider.inject = [options.useClass];
    return provider;
  }
}

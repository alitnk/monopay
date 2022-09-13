import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { drivers } from '../../drivers';

export type MonopayModuleOptions = {
  [Property in keyof typeof drivers]?: typeof drivers[Property];
};

export interface MonopayModuleOptionsFactory {
  createMonopayOptions(): Promise<MonopayModuleOptions> | MonopayModuleOptions;
}

export interface MonopayModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<MonopayModuleOptionsFactory>;
  useClass?: Type<MonopayModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<MonopayModuleOptions> | MonopayModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

import { IDriver } from './driver';

export interface IReceipt {
  getDate(): Date;

  getReferenceId(): string;

  getDriver(): IDriver;

  getDriverName: string;
}

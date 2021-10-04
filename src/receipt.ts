import { Driver } from './driver';

export interface IReceipt {
  getDate(): Date;

  getReferenceId(): string;

  getDriver(): Driver;

  getDriverName: string;
}

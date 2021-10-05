import { Driver } from './driver';

export interface Receipt {
  getDate(): Date;
  getReferenceId(): string;
  getDriver(): Driver;
  getDriverName: string;
}

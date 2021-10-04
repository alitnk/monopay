export interface Type<T> extends Function {
  new (...args: any[]): T;
}

export * from './driver';
export * from './receipt';

type MonoPayErrorConfig = {
  isIPGError: boolean;
  isSafeToDisplay: boolean;
  message?: string;
};

export abstract class MonopayError extends Error {
  /**
   * Determines whether the error was thrown by the IPG or by the application itself
   */
  readonly isIPGError: boolean;
  /**
   * Determines whether the error exposes sensitive information or not
   */
  readonly isSafeToDisplay: boolean;
  constructor(options: MonoPayErrorConfig) {
    super(options.message);
    this.isIPGError = options.isIPGError;
    this.isSafeToDisplay = options.isSafeToDisplay;
  }
}

/**
 * Denotes an error caused by developer configuration
 */
export class BadConfigError extends MonopayError {
  constructor(message: string, isIPGError: boolean) {
    super({ isIPGError, isSafeToDisplay: false, message });
  }
}

/**
 * Denotes an error caused by end user
 */
export class UserError extends MonopayError {
  constructor(message: string) {
    super({ message, isIPGError: true, isSafeToDisplay: true });
  }
}

/**
 * Denotes an error either caused by a failure from gateway or an unrecognizable reason
 */
export class GatewayFailureError extends MonopayError {
  constructor(message?: string) {
    super({ message, isIPGError: true, isSafeToDisplay: false });
  }
}

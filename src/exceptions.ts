type MonoPayErrorConfig = {
  isIPGError: boolean;
  isSafeToDisplay: boolean;
  message?: string;
  code?: string;
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
  /**
   * Contains the IPG error code (if IPG provides any)
   */
  readonly code?: string;
  constructor(options: MonoPayErrorConfig) {
    super(options.message);
    this.isIPGError = options.isIPGError;
    this.isSafeToDisplay = options.isSafeToDisplay;
    this.code = options.code;
  }
}

/**
 * Denotes an error caused by developer configuration
 */
export class BadConfigError extends MonopayError {
  constructor(details: { message: string; code?: string; isIPGError: boolean }) {
    const { message, code, isIPGError } = details;
    super({ message, code, isIPGError, isSafeToDisplay: false });
  }
}

/**
 * Denotes an error caused by end user
 */
export class UserError extends MonopayError {
  constructor(details?: { message?: string; code?: string }) {
    const { message, code } = details ?? {};
    super({ message, code, isIPGError: true, isSafeToDisplay: true });
  }
}

/**
 * Denotes an error either caused by a failure from gateway or an unrecognizable reason
 */
export class GatewayFailureError extends MonopayError {
  constructor(details?: { message?: string; code?: string }) {
    const { message, code } = details ?? {};
    super({ message, code, isIPGError: true, isSafeToDisplay: false });
  }
}

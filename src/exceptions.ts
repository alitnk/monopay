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

export class BasePaymentException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, BasePaymentException.prototype);
  }
}

/**
 * Error in the requesting stage
 */
export class RequestException extends BasePaymentException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, RequestException.prototype);
  }
}

/**
 * Error in the paying stage
 *
 * You can show this error message to your end user
 */
export class PaymentException extends BasePaymentException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, PaymentException.prototype);
  }
}

/**
 * Error in the verification stage
 */
export class VerificationException extends BasePaymentException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, VerificationException.prototype);
  }
}

/**
 * Error when the configuration has problems
 */
export class BadConfigError extends MonopayError {
  constructor(message: string, isIPGError: boolean) {
    super({ isIPGError, isSafeToDisplay: false, message });
  }
}

export class PolypayException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, PolypayException.prototype);
  }
}

/**
 * Error in the requesting stage
 */
export class RequestException extends PolypayException {
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
export class PaymentException extends PolypayException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, PaymentException.prototype);
  }
}

/**
 * Error in the verification stage
 */
export class VerificationException extends PolypayException {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, VerificationException.prototype);
  }
}

/**
 * Error when the configuration has problems
 */
export class BadConfigException extends PolypayException {
  constructor(errors: string[]) {
    super(errors.join(',\n'));
    Object.setPrototypeOf(this, BadConfigException.prototype);
  }
}

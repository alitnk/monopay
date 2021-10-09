export class PolypayException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, PolypayException.prototype);
  }
}

/**
 * Error in the paying stage
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

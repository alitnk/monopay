export class PolypayException extends Error {}

/**
 * Error in the paying stage
 */
export class PaymentException extends PolypayException {
  constructor(message: string, userFriendlyMessage: string = 'خطای غیر منتظره ای رخ داد.') {
    super(message);
    this.userFriendlyMessage = userFriendlyMessage;
    Object.setPrototypeOf(this, PaymentException.prototype);
  }

  /**
   * Message in persian to show the client.
   */
  userFriendlyMessage: string;
}

/**
 * Error in the verification stage
 */
export class VerificationException extends PolypayException {
  constructor(message: string, userFriendlyMessage: string = 'خطای غیر منتظره ای رخ داد.') {
    super(message);
    this.userFriendlyMessage = userFriendlyMessage;
    Object.setPrototypeOf(this, VerificationException.prototype);
  }

  /**
   * Message in persian to show the client.
   */
  userFriendlyMessage: string;
}

export class PolypayException extends Error {}

/**
 * Error in the paying stage
 */
export class PaymentException extends PolypayException {
  /**
   * Message in persian to show the client.
   */
  userFriendlyMessage: string;

  constructor(message: string, userFriendlyMessage: string = 'خطای غیر منتظره ای رخ داد.') {
    super(message);
    this.userFriendlyMessage = userFriendlyMessage;
  }
}

/**
 * Error in the verification stage
 */
export class VerificationException extends PolypayException {
  /**
   * Message in persian to show the client.
   */
  userFriendlyMessage: string;

  constructor(message: string, userFriendlyMessage: string = 'خطای غیر منتظره ای رخ داد.') {
    super(message);
    this.userFriendlyMessage = userFriendlyMessage;
  }
}

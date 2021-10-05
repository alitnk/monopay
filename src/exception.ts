export class PaymentException extends Error {
  /**
   * The message coming back from the API
   */
  userFriendlyMessage: string;

  constructor(message: string, userFriendlyMessage: string = 'خطای غیر منتظره ای رخ داد.') {
    super(message);
    this.userFriendlyMessage = userFriendlyMessage;
  }
}

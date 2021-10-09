export class PolypayException extends Error {}

/**
 * Error in the paying stage
 */
export class PaymentException extends PolypayException {}

/**
 * Error in the verification stage
 */
export class VerificationException extends PolypayException {}

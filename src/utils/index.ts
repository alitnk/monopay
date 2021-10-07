/**
 * Resembles a request object that has the params on it (most likely a `express` request object)
 */
export interface Requestish<ParamsType = any> {
  params: ParamsType;
}

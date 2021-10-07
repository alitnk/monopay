/**
 * Resembles a request object that has the query params on it (most likely a `express` request object)
 */
export interface Requestish<ExpectedQuery = any> {
  query: ExpectedQuery;
}

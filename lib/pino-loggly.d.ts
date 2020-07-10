/**
 * The response token object returned on a successful request.
 * @link https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
 */
export interface LogglyConfig {
  /**
   * The loggly token
   */
  token: string;
  /**
   * The loggly subdomain
   */
  subdomain: string;
  /**
   * True if it's bulk
   */
  isBulk?: boolean;
  /**
   * True if it's json
   */
  json?: boolean;
  bufferOptions?: {
    size: number;
    retriesInMilliSeconds: number;
  };
}

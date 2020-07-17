import loggly from 'node-loggly-bulk';

import stringifySafe from 'json-stringify-safe';
import { LogglyInstance } from 'loggly';

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

const noop = (value: unknown) => value;

export default class Pino2Loggly {
  private callback: unknown;

  private bufferLength: number;

  private bufferTimeout: number;

  private logglyClient: LogglyInstance;

  constructor(logglyConfig: LogglyConfig, bufferLength: number) {
    if (!logglyConfig || !logglyConfig.token || !logglyConfig.subdomain) {
      throw new Error(
        'pino-loggly requires a config object with token and subdomain',
      );
    }

    this.callback = noop;
    this.bufferLength = bufferLength || 1;
    this.bufferTimeout = 30 * 1000;

    const config = { ...logglyConfig };

    config.json = logglyConfig.json !== false;
    config.isBulk = logglyConfig.isBulk !== false;

    if (logglyConfig.isBulk) {
      config.bufferOptions = {
        size: this.bufferLength,
        retriesInMilliSeconds: this.bufferTimeout,
      };
    }

    this.logglyClient = loggly.createClient(config);
  }

  public write(originalData: string) {
    let data = JSON.parse(originalData);
    const pino2Loggly = this;

    // loggly prefers timestamp over time
    if (data.time) {
      data = JSON.parse(stringifySafe(data, null, null, noop));
      data.timestamp = data.time;
      delete data.time;
    }

    pino2Loggly.logglyClient.log(data, (error: unknown, result: unknown) => {
      // @ts-ignore
      pino2Loggly.callback(error, result, data);
    });
  }
}

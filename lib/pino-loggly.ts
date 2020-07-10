import loggly from 'node-loggly-bulk';
import stringifySafe from 'json-stringify-safe';
import { LogglyConfig } from './pino-loggly.d';

const noop = () => {};

export default class Pino2Loggly {
  private callback: Function;
  private bufferLength: any;
  private bufferTimeout: number;
  private logglyClient: any;

  constructor(logglyConfig: LogglyConfig, bufferLength: Number) {
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

  public write(originalData: any) {
    let data = JSON.parse(originalData);
    const pino2Loggly = this;

    // loggly prefers timestamp over time
    if (data.time) {
      data = JSON.parse(stringifySafe(data, null, null, noop));
      data.timestamp = data.time;
      delete data.time;
    }

    pino2Loggly.logglyClient.log(data, (error: any, result: any) => {
      pino2Loggly.callback(error, result, data);
    });
  }
}

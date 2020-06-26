const loggly = require('node-loggly-bulk');
const stringifySafe = require('json-stringify-safe');

const noop = () => {};

function Pino2Loggly(logglyConfig, bufferLength, bufferTimeout, callback) {
  if (!logglyConfig || !logglyConfig.token || !logglyConfig.subdomain) {
    throw new Error(
      'pino-loggly requires a config object with token and subdomain',
    );
  }

  this.callback = callback || noop;
  this.bufferLength = bufferLength || 1;
  this.bufferTimeout = bufferTimeout || 30 * 1000;

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

Pino2Loggly.prototype.write = function write(originalData) {
  let data = JSON.parse(originalData);
  const pino2Loggly = this;

  // loggly prefers timestamp over time
  if (data.time) {
    data = JSON.parse(stringifySafe(data, null, null, noop));
    data.timestamp = data.time;
    delete data.time;
  }

  pino2Loggly.logglyClient.log(data, (error, result) => {
    pino2Loggly.callback(error, result, data);
  });
};

module.exports = Pino2Loggly;

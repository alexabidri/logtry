const _ = require('lodash');
const pino = require('pino');
const Sentry = require('@sentry/node');
const { multistream } = require('pino-multi-stream');

const Pino2Loggly = require('./lib/pino-loggly');
const defaultConfig = require('./config');

function init(config) {
  const finalConfig = _.defaultsDeep(config, defaultConfig);

  const loggerName = finalConfig.logger.name;
  const loggerLevel = finalConfig.logger.level;
  const loggerConfig = {
    name: loggerName,
    level: loggerLevel,
  };

  const streams = [];

  streams.push({ level: loggerLevel, stream: process.stdout });

  if (finalConfig.sentry && finalConfig.sentry.dsn) {
    Sentry.init({
      dsn: finalConfig.sentry.dsn,
      integrations: integrations =>
        integrations.filter(integration => integration.name !== 'Breadcrumbs'),
    });

    const client = {
      level: 'warn',
      stream: {
        write: record => {
          const data = JSON.parse(record);
          Sentry.captureEvent({
            level: 'error',
            timestamp: data.time,
            message: data.msg,
            extra: data,
          });
        },
      },
    };
    streams.push(client);
  }

  if (
    finalConfig.loggly &&
    finalConfig.loggly.token &&
    finalConfig.loggly.subdomain
  ) {
    const logglyStream = new Pino2Loggly(finalConfig.loggly);
    const logglyClient = {
      type: 'raw',
      stream: logglyStream,
    };
    streams.push(logglyClient);
  }

  return pino(loggerConfig, multistream(streams));
}

const logger = init(defaultConfig);

module.exports = logger;
module.exports.init = init;

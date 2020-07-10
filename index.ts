import pino from 'pino';
import Sentry from '@sentry/node';
import { multistream } from 'pino-multi-stream';

import Pino2Loggly from './lib/pino-loggly';
import defaultConfig from './config';
import { Config } from './index.d';

function init(config: Config) {
  const loggerName = config.logger.name;
  const loggerLevel = config.logger.level;
  const loggerConfig = {
    name: loggerName,
    level: loggerLevel,
  };

  const streams = [];

  streams.push({ level: loggerLevel, stream: process.stdout });

  if (config.sentry && config.sentry.dsn) {
    Sentry.init({
      dsn: config.sentry.dsn,
      integrations: (integrations) =>
        integrations.filter(
          (integration) => integration.name !== 'Breadcrumbs',
        ),
    });

    const client = {
      level: 'warn',
      stream: {
        write: (record: any) => {
          const data = JSON.parse(record);
          Sentry.captureEvent({
            // @ts-ignore
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

  if (config.loggly && config.loggly.token && config.loggly.subdomain) {
    const logglyStream = new Pino2Loggly(config.loggly, 1);
    const logglyClient = {
      type: 'raw',
      stream: logglyStream,
    };
    streams.push(logglyClient);
  }

  // @ts-ignore
  return pino(loggerConfig, multistream(streams));
}

// @ts-ignore
const logger = init(defaultConfig);

export default logger;

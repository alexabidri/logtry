"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    logger: {
        name: process.env.LOGGER_NAME || 'dev-logger',
        level: process.env.LOGGER_LEVEL || 'info',
    },
    loggly: {
        token: process.env.LOGGLY_TOKEN,
        subdomain: process.env.LOGGLY_SUBDOMAIN,
        tags: ['bulk'],
        isBulk: false,
    },
    sentry: {
        dsn: process.env.SENTRY_DSN,
    },
};
exports.default = config;

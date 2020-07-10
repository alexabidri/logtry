"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const node_1 = __importDefault(require("@sentry/node"));
const pino_multi_stream_1 = require("pino-multi-stream");
const pino_loggly_1 = __importDefault(require("./lib/pino-loggly"));
const config_1 = __importDefault(require("./config"));
function init(config) {
    const loggerName = config.logger.name;
    const loggerLevel = config.logger.level;
    const loggerConfig = {
        name: loggerName,
        level: loggerLevel,
    };
    const streams = [];
    streams.push({ level: loggerLevel, stream: process.stdout });
    if (config.sentry && config.sentry.dsn) {
        node_1.default.init({
            dsn: config.sentry.dsn,
            integrations: (integrations) => integrations.filter((integration) => integration.name !== 'Breadcrumbs'),
        });
        const client = {
            level: 'warn',
            stream: {
                write: (record) => {
                    const data = JSON.parse(record);
                    node_1.default.captureEvent({
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
        const logglyStream = new pino_loggly_1.default(config.loggly, 1);
        const logglyClient = {
            type: 'raw',
            stream: logglyStream,
        };
        streams.push(logglyClient);
    }
    // @ts-ignore
    return pino_1.default(loggerConfig, pino_multi_stream_1.multistream(streams));
}
// @ts-ignore
const logger = init(config_1.default);
exports.default = logger;

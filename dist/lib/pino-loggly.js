"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_loggly_bulk_1 = __importDefault(require("node-loggly-bulk"));
const json_stringify_safe_1 = __importDefault(require("json-stringify-safe"));
const noop = () => { };
class Pino2Loggly {
    constructor(logglyConfig, bufferLength) {
        if (!logglyConfig || !logglyConfig.token || !logglyConfig.subdomain) {
            throw new Error('pino-loggly requires a config object with token and subdomain');
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
        this.logglyClient = node_loggly_bulk_1.default.createClient(config);
    }
    write(originalData) {
        let data = JSON.parse(originalData);
        const pino2Loggly = this;
        // loggly prefers timestamp over time
        if (data.time) {
            data = JSON.parse(json_stringify_safe_1.default(data, null, null, noop));
            data.timestamp = data.time;
            delete data.time;
        }
        pino2Loggly.logglyClient.log(data, (error, result) => {
            pino2Loggly.callback(error, result, data);
        });
    }
}
exports.default = Pino2Loggly;

import { LogglyConfig } from './pino-loggly.d';
export default class Pino2Loggly {
    private callback;
    private bufferLength;
    private bufferTimeout;
    private logglyClient;
    constructor(logglyConfig: LogglyConfig, bufferLength: Number);
    write(originalData: any): void;
}

export interface Config {
  logger: {
    name: string;
    level: string;
  };
  sentry: {
    dsn?: string;
  };
  loggly: {
    token: string;
    isBulk: boolean;
    subdomain: string;
  };
}

declare const config: {
    logger: {
        name: string;
        level: string;
    };
    loggly: {
        token: string | undefined;
        subdomain: string | undefined;
        tags: string[];
        isBulk: boolean;
    };
    sentry: {
        dsn: string | undefined;
    };
};
export default config;

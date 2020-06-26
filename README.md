# Logtry

A Pino configurable logger for NodeJS to send logs to loggly and sentry

<!-- TOC depthFrom:2 -->

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Use](#use)

<!-- /TOC -->

## Requirements

Minimum Node.js version: 10

## Installation

```bash
npm install --save logtry
```

## Configuration

| Key                | Required | Description                                                                                                                                                                                 |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LOGGER_NAME`      | yes      | Sets the name of the logger.                                                                                                                                                                |
| `LOGGER_LEVEL`     | yes      | Set the minimum level of logs.                                                                                                                                                              |
| `SENTRY_DSN`       | no       | Sentry DSN key ([sentry-doc](https://docs.sentry.io/clients/java/config/#setting-the-dsn))                                                                                                  |
| `LOGGLY_TOKEN`     | no       | Loggly token ([loggly-doc](https://documentation.solarwinds.com/en/Success_Center/loggly/Content/admin/token-based-api-authentication.htm?cshid=loggly_token-based-api-authentication))     |
| `LOGGLY_SUBDOMAIN` | no       | Loggly subdomain ([loggly-doc](https://documentation.solarwinds.com/en/Success_Center/loggly/Content/admin/token-based-api-authentication.htm?cshid=loggly_token-based-api-authentication)) |

## Use

```javascript
'use strict';

const logger = require('logtry');

// Log a fatal error message:
logger.fatal({ err: new Error('Fatal'), field: 'additional info' }, 'fatal message');

// Log an error message:
logger.error({ err: new Error('Error'), anotherField: 'extra context' }, 'error message');

// Log a warning message:
logger.warn({ err: new Error('Warn'), userId:'1e7b8d', age: 17 }, 'Warning while getting info');

// Log an informational message:
logger.info({ field: 1 }, 'info message');

// Log a debug message:
logger.debug({ user }, 'debug message');

// Log a trace message:
logger.trace({ fields: [1, 2, 66]] }, 'trace message');

```

## MIT Licensed

import opentelemetry from '@opentelemetry/api';
import { Logger, logs, SeverityNumber } from '@opentelemetry/api-logs';
import * as winston from 'winston';

import { otelConfig } from './otel.config';
import { observabilityConfig } from '../observability.config';
import { Request, Response } from 'express';

type LogMessageBody =
  | string
  | {
      req?: Request;
      res?: Response;
    };

export class OpenTelemetryLogger {
  private _logger: Logger;
  private _consoleLogger: winston.Logger;
  private _level: 'info' | 'debug' | 'warn' | 'error' | 'fatal' = 'info';

  constructor() {
    this._logger = logs.getLogger(
      otelConfig.OTEL_SERVICE_NAME,
      otelConfig.OTEL_SERVICE_VERSION,
    );
    this._level = observabilityConfig.LOG_LEVEL;

    const transports =
      process.env.NODE_ENV === 'test'
        ? [new winston.transports.Console({ silent: true })]
        : [new winston.transports.Console()];

    this._consoleLogger = winston.createLogger({
      level: this._level,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format((info) => {
          if (process.env.NODE_ENV !== 'test') {
            const span = opentelemetry.trace.getActiveSpan();

            if (span) {
              info.spanId = span.spanContext().spanId;
              info.traceId = span.spanContext().traceId;
            }
          }

          return info;
        })(),
        winston.format.json(),
      ),
      transports,
    });
  }

  private bodyIsExpressRequest(
    body: string | Request | Response,
  ): body is Request {
    return (body as Request).method !== undefined;
  }

  private bodyIsExpressResponse(
    body: string | Request | Response,
  ): body is Request {
    return (body as Response).statusCode !== undefined;
  }

  private buildMessage(body: LogMessageBody) {
    if (
      typeof body === 'object' &&
      body.req &&
      this.bodyIsExpressRequest(body.req)
    ) {
      return `${body.req.method} ${body.req.url}`;
    } else if (
      typeof body === 'object' &&
      body.res &&
      this.bodyIsExpressResponse(body.res)
    ) {
      return `${body.res.req.method} ${body.res.req.url} ${body.res.statusCode}`;
    } else if (typeof body === 'string') {
      return body;
    } else {
      return '';
    }
  }

  private logMessage(
    body: LogMessageBody,
    severityNumber: SeverityNumber,
    severityText: string,
  ) {
    const message = this.buildMessage(body);
    this._consoleLogger[severityText.toLowerCase()](message);

    if (process.env.NODE_ENV !== 'test') {
      this._logger.emit({
        body: message,
        severityNumber,
        severityText,
      });
    }
  }

  info(body: LogMessageBody) {
    this.logMessage(body, SeverityNumber.INFO, 'INFO');
  }

  debug(body: LogMessageBody) {
    this.logMessage(body, SeverityNumber.DEBUG, 'DEBUG');
  }

  warn(body: LogMessageBody) {
    this.logMessage(body, SeverityNumber.WARN, 'WARN');
  }

  error(body: LogMessageBody) {
    this.logMessage(body, SeverityNumber.ERROR, 'ERROR');
  }

  fatal(body: LogMessageBody) {
    this.logMessage(body, SeverityNumber.FATAL, 'FATAL');
  }

  trace(message: string) {
    if (process.env.NODE_ENV !== 'test') {
      this._logger.emit({
        body: message,
        severityNumber: SeverityNumber.TRACE,
        severityText: 'TRACE',
      });
    }
  }
}

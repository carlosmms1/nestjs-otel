import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

import { otelConfig } from './otel.config';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';

export class OpenTelemetry {
  private _sdk: NodeSDK;

  constructor() {
    this._sdk = new NodeSDK({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: otelConfig.OTEL_SERVICE_NAME,
        [ATTR_SERVICE_VERSION]: otelConfig.OTEL_SERVICE_VERSION,
      }),
      traceExporter: new OTLPTraceExporter({
        url: otelConfig.OTEL_OTLP_TRACES_EXPORTER_URL,
      }),
      logRecordProcessor: new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: otelConfig.OTEL_OTLP_LOGS_EXPORTER_URL,
        }),
      ),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: otelConfig.OTEL_OTLP_METRICS_EXPORTER_URL,
        }),
      }),
    });
  }

  public start() {
    this._sdk.start();
  }
}

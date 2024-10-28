import { z } from 'zod';
import 'dotenv/config';

export const otelConfig = z
  .object({
    OTEL_SERVICE_NAME: z
      .string({ required_error: 'Service name is required' })
      .min(1, 'Service name is required.'),
    OTEL_SERVICE_VERSION: z
      .string({ required_error: 'Service version is required' })
      .min(1, 'Service version is required.'),
    OTEL_OTLP_TRACES_EXPORTER_URL: z
      .string({ required_error: 'Traces exporter url is required' })
      .url('Invalid traces exporter url.'),
    OTEL_OTLP_LOGS_EXPORTER_URL: z
      .string({ required_error: 'Logs exporter url is required' })
      .url('Invalid logs exporter url.'),
    OTEL_OTLP_METRICS_EXPORTER_URL: z
      .string({ required_error: 'Metrics exporter url is required' })
      .url('Invalid metrics exporter url.'),
  })
  .parse(process.env);

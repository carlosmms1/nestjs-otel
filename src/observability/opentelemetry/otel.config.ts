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
  })
  .parse(process.env);

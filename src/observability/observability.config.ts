import { z } from 'zod';
import 'dotenv/config';

export const observabilityConfig = z
  .object({
    LOG_LEVEL: z
      .enum(['info', 'debug', 'warn', 'error', 'fatal'])
      .catch('info'),
  })
  .parse(process.env);

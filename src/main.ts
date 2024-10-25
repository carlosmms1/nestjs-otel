import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { OpenTelemetry } from './observability/opentelemetry/otel';

async function bootstrap() {
  if (process.env.NODE_ENV !== 'test') {
    const otel = new OpenTelemetry();
    otel.start();
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

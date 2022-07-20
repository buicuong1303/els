import { extractBooleanEnvVar } from '@els/shared/utils';
import { initializeTracer } from './tracer';
if(extractBooleanEnvVar('ENABLE_TRACING')) {
  initializeTracer('els-notification', ['amqp', 'graphql']);
}
import { initializeApp } from '@els/server/shared';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  ExpressAdapter as Adapter,
  NestExpressApplication as Application,
} from '@nestjs/platform-express';

async function bootstrap() {
  const adapter = new Adapter();
  const app = await NestFactory.create<Application>(AppModule, adapter);
  const port = process.env.PORT || 3333;
  await initializeApp(app, '0.0.0.0', port, '');
}

bootstrap();

import { extractBooleanEnvVar } from '@els/shared/utils';
import { initializeTracer } from './tracer';
if(extractBooleanEnvVar('ENABLE_TRACING')) {
  initializeTracer('els-guardian', ['http', 'graphql', 'grpc']);
}
import { initializeApp, GuardianGrpcServiceClient } from '@els/server/shared';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import fastifyCookie from 'fastify-cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  ); 

  const port = process.env.PORT || 3333;

  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET, // for cookies signature
  });

  await initializeApp(
    app,
    '0.0.0.0',
    port,
    '',
    GuardianGrpcServiceClient.GetConfig().protoPath,
    GuardianGrpcServiceClient.GetConfig().package,
    GuardianGrpcServiceClient.GetConfig().url
  );
}

bootstrap();

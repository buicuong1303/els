
import { extractBooleanEnvVar } from '@els/shared/utils';
import { initializeTracer } from './tracer';
if(extractBooleanEnvVar('ENABLE_TRACING')) {
  initializeTracer('els-dictionary', ['http', 'graphql', 'grpc']);
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import { DictionaryGrpcServiceClient, initializeApp } from '@els/server/shared';
import fgu from 'fastify-gql-upload-ts';

async function bootstrap() {
  const adapter = new FastifyAdapter();
  const fastify = adapter.getInstance();

  fastify.register(fgu);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter
  );

  const port = process.env.PORT || 3333;

  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET, // for cookies signature
  });

  await initializeApp(app, '0.0.0.0', port, '', DictionaryGrpcServiceClient.GetConfig().protoPath, DictionaryGrpcServiceClient.GetConfig().package, DictionaryGrpcServiceClient.GetConfig().url);
}

bootstrap();



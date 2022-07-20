import { extractBooleanEnvVar } from '@els/shared/utils';
import { initializeTracer } from './tracer';
if(extractBooleanEnvVar('ENABLE_TRACING')) {
  initializeTracer('els-learning', ['graphql', 'http']);
}
import { initializeApp, LearningGrpcServiceClient } from '@els/server/shared';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter as BullFastifyAdapter } from '@bull-board/fastify';
import { redisOptions } from '@els/server/learning/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { Queue as QueueMQ } from 'bullmq';
import fastifyCookie from 'fastify-cookie';
import fgu from 'fastify-gql-upload-ts';
import { AppModule } from './app/app.module';

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

  const serverAdapter = new BullFastifyAdapter();

  createBullBoard({
    queues: [
      new BullMQAdapter(
        new QueueMQ('mission-queue', {
          connection: redisOptions,
        })
      ),
      new BullMQAdapter(
        new QueueMQ('notification-queue', {
          connection: redisOptions,
        })
      ),
      new BullMQAdapter(
        new QueueMQ('resource-queue', {
          connection: redisOptions,
        })
      ),
    ],
    serverAdapter: serverAdapter,
  });

  serverAdapter.setBasePath('/admin/queues');

  app.register(serverAdapter.registerPlugin(), {
    prefix: '/admin/queues',
    basePath: '/admin/queues',
  });

  await initializeApp(
    app,
    '0.0.0.0',
    port,
    '',
    LearningGrpcServiceClient.GetConfig().protoPath,
    LearningGrpcServiceClient.GetConfig().package,
    LearningGrpcServiceClient.GetConfig().url
  );
}

bootstrap();


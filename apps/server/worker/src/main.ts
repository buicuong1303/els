import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter as BullFastifyAdapter } from '@bull-board/fastify';
import { initializeApp } from '@els/server/shared';
import { redisOptions } from '@els/server/worker/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { Queue as QueueMQ } from 'bullmq';
import { AppModule } from './app/app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const port = process.env.PORT || 3333;

  const serverAdapter = new BullFastifyAdapter();
  createBullBoard({
    queues: [
      new BullMQAdapter(
        new QueueMQ('els-queue', {
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
  );
}

bootstrap();



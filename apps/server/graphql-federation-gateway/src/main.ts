
import { extractBooleanEnvVar } from '@els/shared/utils';
import { initializeTracer } from './tracer';
if(extractBooleanEnvVar('ENABLE_TRACING')) {
  initializeTracer('els-gfg', ['http', 'fastify']);
}
import { initializeApp } from '@els/server/shared';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import fastifyCookie from 'fastify-cookie';
import * as cors from 'cors';
import { corsWhiteList } from '@els/server/graphql-federation-gateway/common';
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

  app.use(
    cors({
      origin: function (origin, callback) {
        // allow requests with no origin
        if (!origin) return callback(null, true);
        if (corsWhiteList.indexOf(origin) === -1) {
          const message = 'The CORS policy for this origin doesn\'t allow access from the particular origin.';
          return callback(new Error(message), false);
        }
        return callback(null, true);
      },

      credentials: true,
    })
  );

  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET, // for cookies signature
  });

  await initializeApp(app, '0.0.0.0', port, '');
}

bootstrap();


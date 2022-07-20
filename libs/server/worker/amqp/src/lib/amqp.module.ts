/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageHandlerErrorBehavior } from '@golevelup/nestjs-rabbitmq';
import { AmqpProducer } from './amqp.producer';
import { AmqpConsumer } from './amqp.consumer';
import { AmqpLearningService } from './services/amqp-learning.service';
import { SharedServiceModule } from '@els/server/shared';

@Module({
  imports: [
    SharedServiceModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      defaultRpcErrorBehavior: MessageHandlerErrorBehavior.NACK,
      defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
      exchanges: [
        {
          name: 'phpswteam.els',
          type: 'topic',
        },
        {
          name: 'phpswteam.dlx_els',
          type: 'topic',
        },
      ],

      //* amqp://{username}:{password}@{host}:{port}
      uri: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
      connectionInitOptions: { wait: false },
    })
  ],
  providers: [
    AmqpProducer,
    AmqpConsumer,
    AmqpLearningService
  ],
  exports: [
    AmqpProducer,
    AmqpLearningService
  ],
})

export class AmqpModule {}

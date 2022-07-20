/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { forwardRef, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageHandlerErrorBehavior } from '@golevelup/nestjs-rabbitmq';
import { AmqpConsumer } from './amqp.consumer';
import { AmqpProducer } from './amqp.producer';
import { LearningService } from './services/learning.service';
import { FirebaseModule } from '@els/server/notification/firebase/feature';
@Module({
  imports: [
    forwardRef(() => FirebaseModule),
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
  controllers: [],
  providers: [
    AmqpProducer,
    AmqpConsumer,
    LearningService,
  ],
  exports: [
    AmqpProducer,
    LearningService,
  ],
})

export class AmqpModule {}

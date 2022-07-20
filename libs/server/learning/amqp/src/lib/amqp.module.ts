/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CronModule } from '@els/server/learning/cron/feature';
import { MemoryAnalysisModule } from '@els/server/learning/memory-analysis/feature';
import { MessageHandlerErrorBehavior, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { AmqpConsumer } from './amqp.consumer';
import { AmqpProducer } from './amqp.producer';
import { AmqpNotificationService } from './services/amqp-notification.service';
@Module({
  imports: [
    MemoryAnalysisModule,
    CronModule,
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
    }),
  ],
  controllers: [],
  providers: [AmqpProducer, AmqpConsumer, AmqpNotificationService],
  exports: [AmqpProducer, AmqpNotificationService],
})
export class AmqpModule {}

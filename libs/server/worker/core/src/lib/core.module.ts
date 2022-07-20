/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {  Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueuesModule } from '@els/server/worker/queues';
import { CronLearningModule } from '@els/server/worker/cron-learning/feature';
import { AmqpModule } from '@els/server/worker/amqp';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AmqpModule,
    CronLearningModule,
    ScheduleModule.forRoot(),
    CronLearningModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    QueuesModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}

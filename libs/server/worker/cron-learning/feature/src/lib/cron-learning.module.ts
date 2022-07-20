/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { CronLearningService } from '@els/server/worker/cron-learning/data-access/services';
import { AmqpModule } from '@els/server/worker/amqp';
@Module({
  imports: [AmqpModule],
  controllers: [],
  providers: [CronLearningService],
  exports: [CronLearningService],
})
export class CronLearningModule {}

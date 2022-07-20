/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { forwardRef, Module } from '@nestjs/common';
import { CronService } from '@els/server/learning/cron/data-access/services';
import { AmqpModule } from '@els/server/learning/amqp';
import { RankModule } from '@els/server/learning/rank/feature';
import { CronResolver } from './cron.resolver';
import { CronMutationsResolver } from './cron-mutations.resolver';
import { CronController } from './cron.controller';
@Module({
  imports: [forwardRef(() => AmqpModule), RankModule],
  controllers: [CronController],
  providers: [CronService, CronResolver, CronMutationsResolver],
  exports: [CronService],
})
export class CronModule {}

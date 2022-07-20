/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { forwardRef, Module } from '@nestjs/common';
import { StreakService } from '@els/server/learning/streak/data-access/services';
import { StreakResolver } from './streak.resolver';
import { StreakMutationsResolver } from './streak-mutations.resolver';
import { MissionQueueModule } from '@els/server/learning/queues';

@Module({
  imports: [
    forwardRef(() => MissionQueueModule)
  ],
  controllers: [],
  providers: [
    StreakResolver,
    StreakMutationsResolver,
    StreakService,
  ],
  exports: [StreakService],
})
export class StreakModule {}

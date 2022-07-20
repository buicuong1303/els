/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { PubSubModule } from '@els/server/shared';
import { StreakResolver } from './streak.resolver';
import { StreakService } from '@els/server/notification/streak/data-access/services';

@Module({
  imports: [PubSubModule],
  controllers: [],
  providers: [StreakService, StreakResolver],
  exports: [],
})
export class StreakModule {}

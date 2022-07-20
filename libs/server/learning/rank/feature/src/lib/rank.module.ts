/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rank } from '@els/server/learning/rank/data-access/entities';
import { RankType } from '@els/server/learning/rank-type/data-access/entities';
import { RankService } from '@els/server/learning/rank/data-access/services';
import { RankResolver } from './rank.resolver';
import { RankMutationsResolver } from './rank-mutation.resolver';
import { MissionQueueModule } from '@els/server/learning/queues';
import { RedisCacheModule } from '@els/server/shared';
@Module({
  imports: [
    TypeOrmModule.forFeature([Rank, RankType]), 
    MissionQueueModule,
    RedisCacheModule
  ],
  controllers: [],
  providers: [RankService, RankResolver, RankMutationsResolver],
  exports: [RankService],
})
export class RankModule {}

import { Module } from '@nestjs/common';
import { MissionMutationsResolver } from './mission-mutations.resolver';
import { MissionResolver } from './mission.resolver';
import { MissionService } from '@els/server/learning/mission/data-access/services';
import { Mission } from '@els/server/learning/mission/data-access/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignedMissionResolver } from './assigned-mission.resolver';
import { RewardResolver } from './reward.resolver';
import { AssignedMissionMutationsResolver } from './assigned-mission-mutations.resolver';
import { MissionQueueModule } from '@els/server/learning/queues';
import { StreakModule } from '@els/server/learning/streak/feature';
@Module({
  imports: [TypeOrmModule.forFeature([Mission]), MissionQueueModule, StreakModule],
  controllers: [],
  providers: [
    MissionResolver,
    MissionMutationsResolver,
    MissionService,
    AssignedMissionResolver,
    RewardResolver,
    AssignedMissionMutationsResolver,
  ],
  exports: [MissionService],
})
export class MissionModule {}

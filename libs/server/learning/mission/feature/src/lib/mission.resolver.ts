import {
  Mission, Reward
} from '@els/server/learning/mission/data-access/entities';
import { MissionService } from '@els/server/learning/mission/data-access/services';
import {
  AssignedMissionMutations, MissionMutations
} from '@els/server/learning/mission/data-access/types';
import { AuthGuard } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import {
  ComplexityEstimatorArgs, Context, Mutation, Parent, Query, ResolveField, Resolver
} from '@nestjs/graphql';
import DataLoader = require('dataloader');

@Resolver(() => Mission)
export class MissionResolver {
  constructor(private readonly _missionService: MissionService) {}

  @Mutation(() => MissionMutations, { name: 'mission', nullable: true })
  missionMutations() {
    return {};
  }
  @UseGuards(AuthGuard)
  @Mutation(() => AssignedMissionMutations, {
    name: 'assignedMission',
    nullable: true,
  })
  assignedMissionMutations() {
    return {};
  }

  @Query(() => [Mission])
  missions() {
    return this._missionService.getAllMissions();
  }

  @ResolveField(() => Reward, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async reward(
  @Parent() mission: Mission,
    @Context('rewardsLoader') rewardsLoader: DataLoader<string, Reward>
  ) {
    return rewardsLoader.load(mission.rewardId);
  }
}

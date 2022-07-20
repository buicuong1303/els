import {
  AssignedMission, Mission
} from '@els/server/learning/mission/data-access/entities';
import { MissionService } from '@els/server/learning/mission/data-access/services';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import {
  Args, ComplexityEstimatorArgs, Context, Parent, Query, ResolveField, Resolver
} from '@nestjs/graphql';
import DataLoader = require('dataloader');

@Resolver(() => AssignedMission)
export class AssignedMissionResolver {
  constructor(private readonly _missionService: MissionService) {}

  @Query(() => [AssignedMission])
  @UseGuards(AuthGuard)
  assignedMissions(@Auth() identity: Identity, @Args('category') category: string ) {
    return this._missionService.getAssignedMissionsOfUser(identity, category);
  }

  @ResolveField(() => Mission, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async mission(
  @Parent() assignedMissions: AssignedMission,
    @Context('missionsLoader') missionsLoader: DataLoader<string, Mission>
  ) {
    if (assignedMissions.missionId)
      return missionsLoader.load(assignedMissions.missionId);
  }

  @ResolveField(() => Mission, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async missionTarget(
  @Parent() assignedMissions: AssignedMission,
    @Context('missionTargetsLoader')
    missionTargetsLoader: DataLoader<string, Mission>
  ) {
    if (assignedMissions.missionTargetId)
      return missionTargetsLoader.load(assignedMissions.missionTargetId);
  }
}

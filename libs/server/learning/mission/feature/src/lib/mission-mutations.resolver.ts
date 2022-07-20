import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { MissionMutations, AssignMissionInput } from '@els/server/learning/mission/data-access/types';
import { AssignedMission } from '@els/server/learning/mission/data-access/entities';
import { MissionService } from '@els/server/learning/mission/data-access/services';

@Resolver(() => MissionMutations)
export class MissionMutationsResolver {
  constructor(private readonly _missionService: MissionService) {}
  
  @ResolveField(() => AssignedMission, { nullable: true })
  assignNoneRepeatableMission(
  @Args('assignMissionInput') assignMissionInput: AssignMissionInput
  ) {
    return this._missionService.assignNoneRepeatableMission(assignMissionInput.userId);
  }
}

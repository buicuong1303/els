import { AssignedMission } from '@els/server/learning/mission/data-access/entities';
import { MissionService } from '@els/server/learning/mission/data-access/services';
import {
  AssignedMissionMutations, DoneAssignedMissionInput
} from '@els/server/learning/mission/data-access/types';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => AssignedMissionMutations)
export class AssignedMissionMutationsResolver {
  constructor(private readonly _missionService: MissionService) {}
  @ResolveField(() => AssignedMission, { nullable: true})
  doneAssignedMission(
  @Args('doneAssignedMissionInput')
    doneAssignedMissionInput: DoneAssignedMissionInput
  ) {
    return this._missionService.doneAssignedMission(doneAssignedMissionInput);
  }
}

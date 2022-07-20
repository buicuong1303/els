/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { MissionTarget } from '@els/server/learning/user/data-access/entities';
import { UserService } from '@els/server/learning/user/data-access/services';
export const createMissionTargetsLoader = (userService: UserService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct missionTargets
    const missionTargets: MissionTarget[] = await userService.getMissionTargetByIds([...ids]);

    const missionTargetsMap = new Map(missionTargets.map(missionTarget => [missionTarget.id, missionTarget]));
    return ids.map((id) => missionTargetsMap.get(id));
  });
};

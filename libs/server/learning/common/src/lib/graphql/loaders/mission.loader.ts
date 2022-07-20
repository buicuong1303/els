/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { Mission } from '@els/server/learning/mission/data-access/entities';
import { MissionService } from '@els/server/learning/mission/data-access/services';
export const createMissionsLoader = (missionService: MissionService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct missions
    const missions: Mission[] = await missionService.getMissionByIds([...ids]);

    const missionsMap = new Map(missions.map(mission => [mission.id, mission]));
    return ids.map((id) => missionsMap.get(id));
  });
};

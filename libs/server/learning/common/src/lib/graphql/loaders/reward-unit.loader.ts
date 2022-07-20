/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { RewardUnit } from '@els/server/learning/reward-unit/data-access/entities';
import { RewardUnitService } from '@els/server/learning/reward-unit/data-access/services';
export const createRewardUnitsLoader = (rewardUnitService: RewardUnitService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct rewards
    const rewardUnits: RewardUnit[] = await rewardUnitService.getRewardUnitByIds([...ids]);
    const rewardUnitsMap = new Map(rewardUnits.map(rewardUnit => [rewardUnit.id, rewardUnit]));
    return ids.map((id) => rewardUnitsMap.get(id));
  });
};

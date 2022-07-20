/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { Reward } from '@els/server/learning/mission/data-access/entities';
import { MissionService } from '@els/server/learning/mission/data-access/services';
export const createRewardsLoader = (missionService: MissionService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct rewards
    const rewards: Reward[] = await missionService.getRewardByIds([...ids]);

    const rewardsMap = new Map(rewards.map(reward => [reward.id, reward]));
    return ids.map((id) => rewardsMap.get(id));
  });
};

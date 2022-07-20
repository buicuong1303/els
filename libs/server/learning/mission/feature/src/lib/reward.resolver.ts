import {
  Reward
} from '@els/server/learning/mission/data-access/entities';
import { RewardUnit } from '@els/server/learning/reward-unit/data-access/entities';
import {
  ComplexityEstimatorArgs, Context, Parent, ResolveField, Resolver
} from '@nestjs/graphql';
import DataLoader = require('dataloader');

@Resolver(() => Reward)
export class RewardResolver {

  @ResolveField(() => RewardUnit, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async rewardUnit(
  @Parent() reward: Reward,
    @Context('rewardUnitsLoader') rewardUnitsLoader: DataLoader<string, RewardUnit>
  ) {
    return rewardUnitsLoader.load(reward.rewardUnitId);
  }

}

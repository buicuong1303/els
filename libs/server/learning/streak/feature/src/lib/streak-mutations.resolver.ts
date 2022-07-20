import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import {
  MarkStreakInput,
  StreakMutations,
} from '@els/server/learning/streak/data-access/types';
import { Streak } from '@els/server/learning/streak/data-access/entities';
import { StreakService } from '@els/server/learning/streak/data-access/services';
import { Auth, Identity } from '@els/server/shared';
import { missionMiddleware } from '@els/server/learning/common';
@Resolver(() => StreakMutations)
export class StreakMutationsResolver {
  constructor(private readonly _streakService: StreakService) {}
  @ResolveField(() => Streak, {
    nullable: true,
    middleware: [missionMiddleware],
  })
  create(
    @Auth() identity: Identity,
    @Args('markStreakInput') markStreakInput: MarkStreakInput
  ) {
    return this._streakService.markStreak(markStreakInput, identity);
  }
}

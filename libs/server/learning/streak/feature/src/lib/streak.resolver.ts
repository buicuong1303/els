import { Mutation, Resolver, Query, Args, ResolveField, ComplexityEstimatorArgs, Parent, Context } from '@nestjs/graphql';
import { Streak, StreakList } from '@els/server/learning/streak/data-access/entities';
import {  StreakMutations, GetStreaksArgs } from '@els/server/learning/streak/data-access/types';
import { StreakService } from '@els/server/learning/streak/data-access/services'
import DataLoader = require('dataloader');
import { AuthGuard } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';

@Resolver(() => StreakList)
export class StreakResolver {
  constructor(
    private readonly _streakService: StreakService
  ) {}

  @Mutation(() => StreakMutations, { name: 'streak', nullable: true })
  @UseGuards(AuthGuard)
  streakMutations() {
    return {};
  }
  @Query(() => StreakList, { nullable: true})
  @UseGuards(AuthGuard)
  streakList(@Args() getStreaksArgs: GetStreaksArgs) {
    return this._streakService.getStreakList(getStreaksArgs)
  }
  @ResolveField(() => [Streak], { name: 'streaks' })
  streaks(@Parent() streakList: StreakList) {
    return this._streakService.findByStreakListId(streakList.id);
  }
}

/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Context,
  Resolver, Subscription
} from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from '@els/server/shared';
import { Streak } from '@els/server/notification/streak/data-access/types';
import { AuthGuard, GqlContext } from '@els/server/notification/common';

const STREAK_CREATED_EVENT = 'streakCreated';

@Resolver()
export class StreakResolver {
  constructor(
    @Inject(PUB_SUB) private _pubSub: RedisPubSub,
  ) {}

  /*
    Please note that the name of method matches the values of the event in asyncIterator.
    If that’s not the case, we need to pass additional options to the @Subscription() decorator.
  */
  @Subscription(() => Streak, {
    name: STREAK_CREATED_EVENT
  })
  @UseGuards(AuthGuard)
  streakCreated(@Context() ctx: GqlContext) {
    return this._pubSub.asyncIterator(`${STREAK_CREATED_EVENT}_${ctx.identity.account.id}`);
  }
};

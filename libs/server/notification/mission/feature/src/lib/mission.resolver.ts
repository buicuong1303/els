/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Context,
  Resolver, Subscription
} from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from '@els/server/shared';
import { Mission } from '@els/server/notification/mission/data-access/types';
import { AuthGuard, GqlContext } from '@els/server/notification/common';

const MISSION_COMPLETED_EVENT = 'missionCompleted';

@Resolver()
export class MissionResolver {
  constructor(
    @Inject(PUB_SUB) private _pubSub: RedisPubSub,
  ) {}

  /*
    Please note that the name of method matches the values of the event in asyncIterator.
    If that’s not the case, we need to pass additional options to the @Subscription() decorator.
  */
  @Subscription(() => Mission, {
    name: MISSION_COMPLETED_EVENT
  })
  @UseGuards(AuthGuard)
  missionCompleted(@Context() ctx: GqlContext) {
    return this._pubSub.asyncIterator(`${MISSION_COMPLETED_EVENT}_${ctx.identity.account.id}`);
  }
};

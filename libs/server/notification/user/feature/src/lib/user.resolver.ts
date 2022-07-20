/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Resolver, Subscription, Query, Context
} from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from '@els/server/shared';
import { User } from '@els/server/notification/user/data-access/types';
import { UserService } from '@els/server/notification/user/data-access/services';
import { AuthGuard, GqlContext } from '@els/server/notification/common';

const USER_UPDATED_EVENT = 'userUpdated';
const EXP_UP_EVENT = 'expUp';

@Resolver()
export class UserResolver {
  constructor(
    @Inject(PUB_SUB) private _pubSub: RedisPubSub,
    private readonly _userService: UserService,
  ) {}

  /*
    Please note that the name of method matches the values of the event in asyncIterator.
    If that’s not the case, we need to pass additional options to the @Subscription() decorator.
  */
  @Subscription(() => User, {
    name: USER_UPDATED_EVENT
  })
  @UseGuards(AuthGuard)
  userUpdated(@Context() ctx: GqlContext) {
    return this._pubSub.asyncIterator(`${USER_UPDATED_EVENT}_${ctx.identity.account.id}`);
  }

  @Subscription(() => User, {
    name: EXP_UP_EVENT
  })
  @UseGuards(AuthGuard)
  expUp(@Context() ctx: GqlContext) {
    return this._pubSub.asyncIterator(`${EXP_UP_EVENT}_${ctx.identity.account.id}`);
  }

  @Query(() => User)
  users(): User {
    const user: User = {
      id: 'this_is_id',
      level: 0,
      exp: 0,
      nextLevelExp: 0,
      expDate: 0,
      identityId: '',
      idSubscription: '',
      createdAt: undefined,
      updatedAt: undefined
    };

    return user;
  };
};

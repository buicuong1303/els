/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Context, ResolveField, Resolver } from '@nestjs/graphql';
import { RankMutations } from '@els/server/learning/rank/data-access/types';
import { RankService } from '@els/server/learning/rank/data-access/services';
import { Rank } from '@els/server/learning/rank/data-access/entities';
import { GqlContext } from '@els/server/learning/common';

@Resolver(() => RankMutations)
export class RankMutationsResolver {
  constructor(private readonly _rankService: RankService) {}

  @ResolveField(() => Rank, {nullable: true})
  update(@Context() ctx: GqlContext) {
    return this._rankService.updateRank(ctx.cache);
  };
};

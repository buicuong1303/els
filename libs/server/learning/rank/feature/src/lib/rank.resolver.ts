/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { GqlContext } from '@els/server/learning/common';
import { RankType } from '@els/server/learning/rank-type/data-access/entities';
import { Rank, RankUserInfo } from '@els/server/learning/rank/data-access/entities';
import { RankService } from '@els/server/learning/rank/data-access/services';
import { GetRankOfUser, GetRanksWithType, GetRankUserInfo, PaginatedRank, RankMutations } from '@els/server/learning/rank/data-access/types';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import {
  Args, Context, Mutation, Query, Resolver
} from '@nestjs/graphql';
  
@Resolver(() => Rank)
//   @UseGuards(AuthGuard)
export class RankResolver {
  constructor(private readonly _rankService: RankService) {}

  @Mutation(() => RankMutations, { name: 'rank', nullable: true })
  rank() {
    return {};
  }

  @Query(() => PaginatedRank)
  async ranks(@Args() getRanksWithType: GetRanksWithType, @Context() ctx: GqlContext) {
    const data = await ctx.cache.get(`data-caching:rank:pageNumber_${getRanksWithType.pageNumber}:limit_${getRanksWithType.limit}:name_${getRanksWithType.name}`);
    if(data){
      return JSON.parse(data);
    }
    return this._rankService.getRanksWithType(getRanksWithType, ctx.cache);
  };

  @Query(() => [RankType])
  rankType(@Context() ctx: GqlContext) {
    return this._rankService.getRankType(ctx);
  };

  @Query(() => RankType)
  rankTypeFromCache(@Context() ctx: GqlContext) {
    return this._rankService.getRankTypeFromCache(ctx);
  };

  @Query(() => Rank, { name: 'myRank' })
  @UseGuards(AuthGuard)
  myRank(@Args() getRankOfUser: GetRankOfUser, @Auth() identity: Identity) {
    return this._rankService.getRankOfUser(getRankOfUser, identity);
  };

  @Query(() => RankUserInfo)
  rankUserInfo(@Args() getRankUserInfo: GetRankUserInfo) {
    return this._rankService.getInfoRankUser(getRankUserInfo.userId);
  };
}
  
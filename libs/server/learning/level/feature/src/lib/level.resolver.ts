import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { Level } from '@els/server/learning/level/data-access/entities';
import { LevelService } from '@els/server/learning/level/data-access/services';
import { LevelMutations } from '@els/server/learning/level/data-access/types';
@Resolver(() => Level)
export class LevelResolver {
  constructor(
    private readonly _levelService: LevelService
  ) {}
  @Mutation(() => LevelMutations, { name: 'level', nullable: true })
  levelMutations() {
    return {};
  }

  @Query(() => [Level])
  levels() {
    return this._levelService.getLevels();
  }
}

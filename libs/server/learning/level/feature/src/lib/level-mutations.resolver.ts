import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import {
  LevelMutations,
  CreateLevelInput,
} from '@els/server/learning/level/data-access/types';
import { Level } from '@els/server/learning/level/data-access/entities';
import { LevelService } from '@els/server/learning/level/data-access/services';
@Resolver(() => LevelMutations)
export class LevelMutationsResolver {
  constructor(private readonly _levelService: LevelService) {}

  @ResolveField(() => Level)
  create(@Args('createLevelInput') createLevelInput: CreateLevelInput) {
    return this._levelService.createLevel(createLevelInput);
  }
}

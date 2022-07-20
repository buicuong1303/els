import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { SkillLevelMutations, CreateSkillLevelInput, UpdateSkillLevelInput  } from '@els/server/learning/skill-level/data-access/types';
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities'
import { SkillLevelService } from '@els/server/learning/skill-level/data-access/services';
@Resolver(() => SkillLevelMutations )
export class SkillLevelMutationsResolver {
  constructor(
    private readonly skillLevelService: SkillLevelService
  ){}
  @ResolveField(() => SkillLevel)
  create(@Args('createSkillLevelInput') createSkillLevelInput: CreateSkillLevelInput) {
    return this.skillLevelService.createSkillLevel(createSkillLevelInput);
  }

  @ResolveField(() => SkillLevel)
  update(@Args('updateSkillLevelInput') updateSkillLevelInput: UpdateSkillLevelInput) {
    return this.skillLevelService.updateSkillLevel(updateSkillLevelInput);
  }
}
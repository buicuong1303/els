import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import {
  SkillMutations,
  UpdateSkillInput
} from '@els/server/learning/skill/data-access/types';
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { SkillService } from '@els/server/learning/skill/data-access/services';
@Resolver(() => SkillMutations)
export class SkillMutationsResolver {
  constructor(private readonly _skillService: SkillService) {}

  @ResolveField(() => Skill)
  update(@Args('updateSkillInput') updateSkillInput: UpdateSkillInput) {
    return this._skillService.updateSkill(updateSkillInput);
  }
}

import { Skill } from '@els/server/learning/skill/data-access/entities';
import { SkillService } from '@els/server/learning/skill/data-access/services';
import { SkillMutations } from '@els/server/learning/skill/data-access/types';
import { Mutation, Resolver } from '@nestjs/graphql';
@Resolver(() => Skill)
export class SkillResolver {
  constructor(
    private readonly _skillService: SkillService
  ) {}

  @Mutation(() => SkillMutations, { name: 'skill', nullable: true })
  skillMutations() {
    return {};
  }
}

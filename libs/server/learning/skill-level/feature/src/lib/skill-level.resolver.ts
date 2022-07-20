import { ResolveField, Mutation, Resolver } from '@nestjs/graphql';
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities';
import { SkillLevelMutations } from '@els/server/learning/skill-level/data-access/types'
@Resolver(() => SkillLevel )
export class SkillLevelResolver {

  @Mutation(() => SkillLevelMutations, { name: 'skillLevel', nullable: true})
  skillLevelMutations() {
    return {}
  }
}
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ResolveField, Resolver, Parent, Context, ComplexityEstimatorArgs } from '@nestjs/graphql';
import {
  ActualSkill
} from '@els/server/learning/memory-analysis/data-access/entities';
import DataLoader = require('dataloader');
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities';
import { SkillLevelService } from '@els/server/learning/skill-level/data-access/services';
@Resolver(() => ActualSkill)
export class ActualSkillResolver {
  constructor(
    private readonly _skillLevelService: SkillLevelService
  ) {}
  @ResolveField(() => Skill, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async skill(
  @Parent() actualSkill: ActualSkill,
    @Context('skillsLoader') skillsLoader: DataLoader<string, Skill>
  ) {
    return skillsLoader.load(actualSkill.skillId);
  }

  @ResolveField(() => SkillLevel, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async skillLevel(
  @Parent() actualSkill: ActualSkill,
  ) {
    return this._skillLevelService.findById(actualSkill.skillLevelId);
  }

  
}

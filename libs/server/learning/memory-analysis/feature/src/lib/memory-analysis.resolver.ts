/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Enrollment } from '@els/server/learning/common';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import {
  ActualSkill, MemoryAnalysis
} from '@els/server/learning/memory-analysis/data-access/entities';
import { MemoryAnalysisService } from '@els/server/learning/memory-analysis/data-access/services';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { ComplexityEstimatorArgs, Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader = require('dataloader');
@Resolver(() => MemoryAnalysis)
export class MemoryAnalysisResolver {
  constructor(
    private readonly _memoryAnalysisService: MemoryAnalysisService
  ){}
  @ResolveField(() => Vocabulary, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })

  async vocabulary(
  @Parent() memoryAnalysis: MemoryAnalysis,
    @Context('vocabulariesLoader') vocabulariesLoader: DataLoader<string, Vocabulary>
  ) {
    return vocabulariesLoader.load(memoryAnalysis.vocabularyId);
  }

  @ResolveField(() => MemoryAnalysis, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async lesson(
  @Parent() memoryAnalysis: MemoryAnalysis,
    @Context('lessonsLoader') lessonsLoader: DataLoader<string, Lesson>
  ) {
    return lessonsLoader.load(memoryAnalysis.lessonId);
  }

  @ResolveField(() => [ActualSkill], {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async actualSkills(
  @Parent() memoryAnalysis: MemoryAnalysis,
  ) {
    return this._memoryAnalysisService.findActualSkillsByMemoryAnalysisId(memoryAnalysis.id);
  }

  @ResolveField(() => MemoryAnalysis, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async student(
  @Parent() memoryAnalysis: MemoryAnalysis,
    @Context('enrollmentsLoader') enrollmentsLoader: DataLoader<string, Enrollment>
  ) {
    return enrollmentsLoader.load(memoryAnalysis.studentId);
  }
}

import {
  missionMiddleware
} from '@els/server/learning/common';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import { EnrollmentService } from '@els/server/learning/enrollment/data-access/services';
import {
  CreateEnrollmentInput, EnrollmentMutations, LearnVocabularyInput, UnTrackVocabularyInput, UpdateMemoryAnalysisInput
} from '@els/server/learning/enrollment/data-access/types';
import { MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { Auth, Identity } from '@els/server/shared';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => EnrollmentMutations)
export class EnrollmentMutationsResolver {
  constructor(
    private readonly _enrollmentService: EnrollmentService,
  ) {}
  //* Join topic
  @ResolveField(() => Enrollment, { nullable: true })
  create(
  @Args('createEnrollmentInput') createEnrollmentInput: CreateEnrollmentInput,
    @Auth() identity: Identity
  ) {
    return this._enrollmentService.createEnrollment(
      createEnrollmentInput,
      identity
    );
  }
  //* when student perform a exam
  @ResolveField(() => Enrollment, {
    nullable: true,
    middleware: [missionMiddleware],
  })
  updateMemoryAnalysis(
  @Args('updateMemoryAnalysisInput')
    updateMemoryAnalysisInput: UpdateMemoryAnalysisInput,
    @Auth('identity') identity: Identity
  ) {
    return this._enrollmentService.updateMemoryAnalysis(
      updateMemoryAnalysisInput,
      identity
    );
  }

  @ResolveField(() => MemoryAnalysis, {
    nullable: true,
    middleware: [missionMiddleware],
  })
  learnVocabulary(
  @Args('learnVocabularyInput')
    learnVocabularyInput: LearnVocabularyInput,
    @Auth('identity') identity: Identity
  ) {
    return this._enrollmentService.learnVocabulary(learnVocabularyInput, identity);
  }

  @ResolveField(() => MemoryAnalysis, { nullable: true })
  async unTrackVocabulary(
  @Args('unTrackVocabularyInput')
    unTrackVocabularyInput: UnTrackVocabularyInput,
    @Auth() identity: Identity
  ) {
    return this._enrollmentService.unTrackVocabulary(unTrackVocabularyInput, identity);
  }

  @ResolveField(() => MemoryAnalysis, { nullable: true })
  async trackVocabulary(
  @Args('memoryAnalysisId')
    memoryAnalysisId: string
  ) {
    return this._enrollmentService.trackVocabulary(memoryAnalysisId);
  }

}

import {
  Enrollment,
  SummaryMemoryStatus
} from '@els/server/learning/enrollment/data-access/entities';
import { EnrollmentService } from '@els/server/learning/enrollment/data-access/services';
import {
  EnrollmentMutations,
  GetEnrollmentArgs
} from '@els/server/learning/enrollment/data-access/types';
import { MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { UserService } from '@els/server/learning/user/data-access/services';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import {
  Args, ComplexityEstimatorArgs, Context, Mutation, Parent, Query, ResolveField,
  Resolver
} from '@nestjs/graphql';
import DataLoader = require('dataloader');
@Resolver(() => Enrollment)
export class EnrollmentResolver {
  constructor(
    private readonly _enrollmentService: EnrollmentService,
    private readonly _userService: UserService
  ) {}

  @Mutation(() => EnrollmentMutations, { name: 'enrollment', nullable: true })
  @UseGuards(AuthGuard)
  async enrollmentMutations() {
    return {};
  }

  @Query(() => Enrollment,  { nullable: true })
  @UseGuards(AuthGuard)
  enrollment(@Args() getEnrollmentArgs: GetEnrollmentArgs, @Auth() identity: Identity) {
    return this._enrollmentService.getEnrollment(getEnrollmentArgs.topicId, identity);
  }

  @ResolveField(() => [MemoryAnalysis], {
    name: 'memoryAnalyses',
    nullable: true,
  })
  memoryAnalyses(@Parent() enrollment: Enrollment) {
    return this._enrollmentService.findMemoryAnalysisByEnrollmentId(
      enrollment.id
    );
  }

  @ResolveField(() => SummaryMemoryStatus, { nullable: true })
  summaryMemoryStatus(@Parent() student: Enrollment) {
    return this._enrollmentService.summaryMemoryStatus(student.id);
  }

  @ResolveField(() => Topic, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async topic(
  @Parent() enrollment: Enrollment,
    @Context('topicsLoader') topicsLoader: DataLoader<string, Topic>
  ) {
    return topicsLoader.load(enrollment.topicId);
  }
  @ResolveField(() => Topic, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async user(@Parent() enrollment: Enrollment) {
    return this._userService.findUserById(enrollment.userId);
  }

}

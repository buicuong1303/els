import { EnrollmentService } from '@els/server/learning/enrollment/data-access/services';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { LessonService } from '@els/server/learning/lesson/data-access/services';
import {
  GetLessonArgs, GetLessonsArgs, LessonMutations
} from '@els/server/learning/lesson/data-access/types';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { VocabularyService } from '@els/server/learning/vocabulary/data-access/services';
import { checkCache } from '@els/server/shared';
import {
  Args, ComplexityEstimatorArgs, Context, Mutation, Parent, Query,
  ResolveField, Resolver
} from '@nestjs/graphql';
import * as DataLoader from 'dataloader';
@Resolver(() => Lesson)
export class LessonResolver {
  constructor(
    private readonly _lessonService: LessonService,
    private readonly _vocabularyService: VocabularyService,
    private readonly _enrollmentService: EnrollmentService
  ) {}

  @Mutation(() => LessonMutations, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'lesson',
  })
  lessonMutations() {
    return {};
  }

  // @Query(() => PaginatedLesson)
  // lessons(@Args() getLessonsArgs: GetLessonsArgs) {
  //   return this._lessonService.getLessons(getLessonsArgs);
  // }

  @Query(() => [Lesson])
  lessons(@Args() getLessonsArgs: GetLessonsArgs) {
    return this._lessonService.getLessons(getLessonsArgs);
  }

  @Query(() => Lesson)
  lesson(@Args() getLessonArgs: GetLessonArgs) {
    return this._lessonService.getLesson(getLessonArgs);
  }

  @ResolveField(() => [Vocabulary], { name: 'vocabularies' })
  vocabularies(@Parent() lesson: Lesson, @Context() ctx) {
    return checkCache(ctx.cache, `data-caching:vocabularies:lesson_${lesson.id}`,  this._vocabularyService.findByLessonId.bind(this._vocabularyService, lesson.id), 30 * 24 * 60 * 60);
  }

  // @ResolveField(() => [MemoryAnalysis], { name: 'memoryAnalyses' })
  // memoryAnalyses(@Parent() lesson: Lesson) {
  //   return this._enrollmentService.findMemoryAnalysisByLessonId(lesson.id);
  // }

  @ResolveField(() => Topic, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async topic(
  @Parent() lesson: Lesson,
    @Context('topicsLoader') topicsLoader: DataLoader<string, Topic>
  ) {
    return topicsLoader.load(lesson.topicId);
  }
}

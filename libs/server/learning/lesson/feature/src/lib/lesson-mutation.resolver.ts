import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { LessonMutations } from '@els/server/learning/lesson/data-access/types';
import { LessonService } from '@els/server/learning/lesson/data-access/services';
import {
  CreateLessonInput,
  DeleteLessonsInput,
  RestoreLessonsInput
} from '@els/server/learning/lesson/data-access/types';
import { DeleteMany } from '@els/server/shared';

@Resolver(() => LessonMutations)
export class LessonMutationsResolver {
  constructor(private readonly _lessonService: LessonService) {}

  @ResolveField(() => Lesson)
  create(@Args('createLessonInput') createLessonInput: CreateLessonInput) {
    return this._lessonService.createLesson(createLessonInput);
  }

  @ResolveField(() => DeleteMany)
  deleteMany(@Args('deleteLessonInput') deleteLessonsInput: DeleteLessonsInput) {
    return this._lessonService.deleteLessonsByIds(deleteLessonsInput.ids);
  }

  @ResolveField(() => DeleteMany)
  restoreMany(@Args('restoreLessonInput') restoreLessonsInput: RestoreLessonsInput) {
    return this._lessonService.restoreLessonsByIds(restoreLessonsInput.ids);
  }
}

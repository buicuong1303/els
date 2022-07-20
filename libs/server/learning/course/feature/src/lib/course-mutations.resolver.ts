import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { Course } from '@els/server/learning/course/data/access/entities';
import { CourseMutations } from '@els/server/learning/course/data/access/types';
import { CourseService } from '@els/server/learning/course/data/access/services';
import {
  CreateCourseInput,
  UpdateCourseInput,
} from '@els/server/learning/course/data/access/types';

@Resolver(() => CourseMutations)
export class CourseMutationsResolver {
  constructor(private readonly _courseService: CourseService) {}

  @ResolveField(() => Course)
  create(
    @Args('createCourseInput') createCourseInput: CreateCourseInput
  ): Course {
    return this._courseService.createCourse(createCourseInput);
  }

  @ResolveField(() => Course)
  update(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput
  ): Course {
    return this._courseService.updateCourse(updateCourseInput);
  }

  @ResolveField(() => Course)
  delete(@Args('id') id: string): Course {
    return this._courseService.deleteCourse(id);
  }
}

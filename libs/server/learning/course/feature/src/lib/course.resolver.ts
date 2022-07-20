import {
  Resolver,
  Query,
  Mutation,
  ResolveField,
  Args,
  Parent,
  Context,
} from '@nestjs/graphql';

import { AuthGuard, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import { Course } from '@els/server/learning/course/data/access/entities';
import { CourseService } from '@els/server/learning/course/data/access/services';
import {
  GetCourseArgs,
  GetCoursesArgs,
} from '@els/server/learning/course/data/access/types';
import {
  CourseMutations,
  CourseQueries,
  Section,
} from '@els/server/learning/course/data/access/types';
import { Auth } from '@els/server/shared';
import { GqlContext } from '@els/server/learning/common';

/**
 * * remove Course at @Resolver if using for IMPLEMENT module
 * * resolve for Course if this is CURD module
 */
@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly _courseService: CourseService) {}
  @Mutation(() => CourseMutations, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'course',
  })
  courseMutations() {
    return {};
  }

  /**
   * * only using for IMPLEMENT resource
   * * cannot using for CRUD resource because @Parent is hard to implement
   */
  // @Query(() => CourseQueries, {
  //   nullable: true,
  //   description: 'Root query for all courses related queries',
  //   name: 'course',
  // })
  // courseQueries() {
  //   return {};
  // }

  /**
   * * if using courseQueries, not using this block below
   * * below block only using for CRUD resource
   * ! deprecated because using this same get courses with ids[] is 1 element
   */
  // @UseGuards(AuthGuard)
  // @Query(() => Course)
  // course(@Args() getCourseArgs: GetCourseArgs): Course {
  //   return this._courseService.getCourse(getCourseArgs.id);
  // }

  @Query(() => [Course])
  courses(@Args() getCoursesArgs: GetCoursesArgs, @Auth() identity: Identity): Course[] {
    return this._courseService.getCourses(getCoursesArgs)
  }

  @ResolveField(() => [Section])
  sections(@Parent() course: Course): Section[]{
    const courseChild = new Section();
    courseChild.id = 'id';
    courseChild.name = 'name';
    courseChild.courseId = course.id

    return [courseChild];
  }
}

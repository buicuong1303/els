import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { CourseQueries } from '@els/server/learning/course/data/access/types';
import { Course } from '@els/server/learning/course/data/access/entities';
import { CourseService } from '@els/server/learning/course/data/access/services';
import {
  GetCourseArgs,
  GetCoursesArgs,
} from '@els/server/learning/course/data/access/types';
import { DateType, JSONType, IPv4Type, TimeType } from '@els/server/shared';
import { exceptions } from '@els/server/shared';
import { Logger } from '@nestjs/common';

@Resolver(() => CourseQueries)
export class CourseQueriesResolver {
  constructor(private readonly _courseService: CourseService) {}
  private _logger = new Logger(CourseQueriesResolver.name);

  @ResolveField(() => Course)
  getCourse(@Args() getCourseArgs: GetCourseArgs): Course {
    return this._courseService.getCourse(getCourseArgs.id);
  }

  @ResolveField(() => [Course])
  getCourses(@Args() getCoursesArgs: GetCoursesArgs): Course[] {
    return this._courseService.getCourses(getCoursesArgs);
  }

  /**
   * below code for test override custom scalar from graphql-scalars
   * @returns same any
   */
  @ResolveField(() => JSONType)
  getDateScalar(): JSONType {
    return {
      id: 'id',
      fistName: 'Justin',
      lastName: 'Nguyen',
    };
  }

  @ResolveField(() => DateType)
  getDateTimeScalar(): DateType {
    return new Date();
  }

  @ResolveField(() => IPv4Type)
  getIPv4ObjectScalar(): IPv4Type {
    throw new exceptions.NotFoundError('Not found IP', this._logger);
  }

  @ResolveField(() => TimeType)
  getTimeObjectScalar(): TimeType {
    return new Date();
  }
}

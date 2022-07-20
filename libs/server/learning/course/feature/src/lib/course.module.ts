import { CourseResolver } from './course.resolver';
import { CourseMutationsResolver } from './course-mutations.resolver';

//* only using for IMPLEMENT resource
import { CourseQueriesResolver } from './course-queries.resolver';

import { Module } from '@nestjs/common';
import { CourseService } from '@els/server/learning/course/data/access/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '@els/server/learning/course/data/access/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [
    CourseService,
    CourseResolver,
    CourseMutationsResolver,
    //* only using for IMPLEMENT resource
    // CourseQueriesResolver,
  ],
  exports: [CourseService],
})
export class CourseModule {}

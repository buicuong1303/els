/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { LessonResolver } from './lesson.resolver';
import { LessonMutationsResolver } from './lesson-mutation.resolver';
import { LessonService } from '@els/server/learning/lesson/data-access/services';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyModule } from '@els/server/learning/vocabulary/feature';
import { EnrollmentModule } from '@els/server/learning/enrollment/feature';
@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), VocabularyModule, EnrollmentModule],
  providers: [LessonResolver, LessonMutationsResolver, LessonService],
  exports: [LessonService],
})
export class LessonModule {}

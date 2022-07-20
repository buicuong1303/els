import { Injectable, Logger } from '@nestjs/common';
import { Course } from '@els/server/learning/course/data/access/entities';
import {
  CreateCourseInput,
  UpdateCourseInput,
  GetCoursesArgs,
} from '@els/server/learning/course/data/access/types';
import { InjectRepository } from '@nestjs/typeorm';

//TODO: need implement paginate function for lazy load
import { Connection, Repository } from 'typeorm';
import { paginate } from '@els/server/shared';

@Injectable()
export class CourseService {
  private readonly _logger = new Logger(CourseService.name);
  constructor(
    @InjectRepository(Course)
    private readonly _courseRepository: Repository<Course>
  ) {}

  getCourse(id: string): Course {
    return {
      id: id,
      createdAt: new Date(),
      name: 'create',
      updatedAt: new Date(),
      createdBy: 'createdBy',
      deletedAt: new Date(),
      updatedBy: 'updatedBy',
    };
  }

  getCourses(getCoursesArgs: GetCoursesArgs): Course[] {
    return (
      getCoursesArgs.ids?.map((id: string) => {
        return {
          id,
          createdAt: new Date(),
          name: `create ${id}`,
          updatedAt: new Date(),
          createdBy: 'createdBy',
          deletedAt: new Date(),
          updatedBy: 'updatedBy',
        };
      }) ?? []
    );
  }

  createCourse(createCourseInput: CreateCourseInput): Course {
    const course = {
      id: 'id',
      createdAt: new Date(),
      name: 'create',
      updatedAt: new Date(),
      createdBy: 'createdBy',
      deletedAt: new Date(),
      updatedBy: 'updatedBy',
    };
    return { ...course, ...createCourseInput };
  }

  updateCourse(updateCourseInput: UpdateCourseInput): Course {
    const course = {
      id: 'id',
      createdAt: new Date(),
      name: 'update',
      updatedAt: new Date(),
      createdBy: 'createdBy',
      deletedAt: new Date(),
      updatedBy: 'updatedBy',
    };
    return { ...course, ...updateCourseInput };
  }

  deleteCourse(id: string): Course {
    return {
      id: id,
      createdAt: new Date(),
      name: 'update',
      updatedAt: new Date(),
      createdBy: 'createdBy',
      deletedAt: new Date(),
      updatedBy: 'updatedBy',
    };
  }
}

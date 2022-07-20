/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { LessonService } from '@els/server/learning/lesson/data-access/services';
export const createLessonsLoader = (lessonService: LessonService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct lesson
    const lessons: Lesson[] = await lessonService.getLessonsByIds([...ids]);

    const lessonsMap = new Map(lessons.map(lesson => [lesson.id, lesson]));
    return ids.map((id) => lessonsMap.get(id));
  });
};

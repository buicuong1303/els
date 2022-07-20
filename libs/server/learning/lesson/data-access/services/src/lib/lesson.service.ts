/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import {
  CreateLessonInput, GetLessonArgs, GetLessonsArgs
} from '@els/server/learning/lesson/data-access/types';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { exceptions } from '@els/server/shared';
import { trycat } from '@els/shared/utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Repository } from 'typeorm';
@Injectable()
export class LessonService {
  private readonly _logger = new Logger(LessonService.name);
  constructor(
    @InjectRepository(Lesson)
    private readonly _lessonRepository: Repository<Lesson>,
    private readonly _connection: Connection
  ) {}
  async createLesson(createLessonInput: CreateLessonInput) {
    const { name, topicId } = createLessonInput;
    const isExistLesson = await this._lessonRepository.findOne({
      where: {
        name,
        topicId
      },
    });
    if (isExistLesson)
      throw new exceptions.ConflictError('Lesson has been exist', this._logger);
    const infoTopic = await this._connection
      .getRepository(Topic)
      .findOne(createLessonInput.topicId);
    try {
      if (!infoTopic)
        throw new exceptions.NotFoundError('Not found topic', this._logger);
      const newLesson = this._lessonRepository.create(createLessonInput);
      newLesson.topic = infoTopic;
      return this._lessonRepository.save(newLesson);
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Internal server',
        this._logger,
        error
      );
    }
  }

  async getLessons(getLessonsArgs: GetLessonsArgs) {
    const [data, e] = await trycat(this._lessonRepository.find({
      where: {
        id: In(getLessonsArgs.ids || [])
      }
    })) ;
    if (e) throw new exceptions.InternalServerError('Can not get lessons', this._logger, e);
    return data;
  }
  async getLesson(getLessonsArgs: GetLessonArgs) {
    return this._lessonRepository.findOne(getLessonsArgs.id);
  }
  //* for resolver field
  async findByTopicId(id: string) {
    return this._lessonRepository.find({
      where: {
        topicId: id,
      },
      order: { level: 'ASC' }
    });
  }

  async deleteLessonsByIds(ids: string[]) {
    let affected = 0;
    for (let index = 0; index < ids.length; index++) {
      const lesson = await this._lessonRepository.findOne(
        { id: ids[index] },
      );
      if (!lesson) throw new exceptions.NotFoundError('Not found', this._logger);
      this._lessonRepository.softRemove(lesson);
      affected += 1;
    }
    return {
      affected: affected,
    };
  }
  async restoreLessonsByIds(ids: string[]) {
    let affected = 0;
    for (let index = 0; index < ids.length; index++) {
      const lesson = await this._lessonRepository.findOne(
        { id: ids[index] },
        { withDeleted: true } //* must have relation to auto restore related children
      );
      if (!lesson) throw new exceptions.NotFoundError('Not found', this._logger);
      this._lessonRepository.recover(lesson);
      affected += 1;
    }
    return {
      affected: affected,
    };
  }

  //* For loader
  async getLessonsByIds(ids: string[]) {
    return this._lessonRepository.findByIds(ids);
  }
}

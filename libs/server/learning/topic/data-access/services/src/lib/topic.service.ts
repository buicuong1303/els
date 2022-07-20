/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  ActualSkill,
  Category,
  Language,
  Lesson,
  MemoryAnalysis,
  MemoryStatus,
  Prompt,
  Resource,
  ResourceCategory,
  Skill,
  Vocabulary,
} from '@els/server/learning/common';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import { ActualSkillHistory } from '@els/server/learning/memory-analysis/data-access/entities';
import { QuestionService } from '@els/server/learning/question/data-access/services';
import { ResourceQueueService } from '@els/server/learning/queues';
import { Specialization } from '@els/server/learning/specialization/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import {
  CreateTopicInput,
  GetActualSkillHistoryArgs,
  GetMyTopicDetailsArgs,
  GetTopicsArgs,
  SyncThumbnailTopicInput
} from '@els/server/learning/topic/data-access/types';
import { User } from '@els/server/learning/user/data-access/entities';
import {
  axios,
  BaseLang,
  DictionaryGrpcServiceClient,
  exceptions,
  Identity,
  MinIoService,
  pagination,
  TextToSpeechService,
} from '@els/server/shared';
import { DateUtil, StringUtil, trycat } from '@els/shared/utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Connection, In, IsNull, Not, QueryRunner, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
@Injectable()
export class TopicService {
  private readonly _logger = new Logger(TopicService.name);
  constructor(
    @InjectRepository(Topic)
    private readonly _topicRepository: Repository<Topic>,
    private readonly _connection: Connection,
    private readonly _questionService: QuestionService,
    private readonly _dictionaryGrpcServiceClient: DictionaryGrpcServiceClient,
    private readonly _textToSpeechService: TextToSpeechService,
    private readonly _resourceQueueService: ResourceQueueService,
    private readonly _minIoService: MinIoService,
  ) {}

  private async _calcMemoryFluctuations(
    memoryAnalyses: MemoryAnalysis[],
    maxLastStudiedAt: Date
  ) {
    const memoryFluctuations = memoryAnalyses.reduce(
      (pre, memoryAnalysis: MemoryAnalysis) => {
        switch (memoryAnalysis.memoryStatus) {
          case MemoryStatus.memorized:
            if (
              moment(memoryAnalysis.lastChangedMemoryStatusAt).format(
                'YYYY-MM-DD'
              ) === moment().format('YYYY-MM-DD')
            )
              pre.memorized = ++pre.memorized;
            break;
          case MemoryStatus.vague:
            if (
              moment(memoryAnalysis.lastChangedMemoryStatusAt)
                .toDate()
                .getTime() >= maxLastStudiedAt.getTime()
            )
              pre.vague = ++pre.vague;
            break;
          default:
            if (
              moment(memoryAnalysis.lastChangedMemoryStatusAt)
                .toDate()
                .getTime() >= maxLastStudiedAt.getTime()
            )
              pre.forgot = ++pre.forgot;
            break;
        }
        return pre;
      },
      {
        memorized: 0,
        vague: 0,
        forgot: 0,
      }
    );
    return memoryFluctuations;
  }

  private async _createVocabularies(
    vocabularies: any[],
    createdTopic: Topic,
    lessonsMap: Map<string, Lesson>,
    queryRunner: QueryRunner
  ) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < vocabularies.length; index++) {
      const vocabulary = vocabularies[index];
      const reference = await this._dictionaryGrpcServiceClient.getReference({
        vocabulary: vocabulary['Vocabulary'].trim(),
        langCode: 'en',
        pos: vocabulary['POS'].trim(),
      });

      const newVocabulary = this._connection.getRepository(Vocabulary).create();
      newVocabulary.vocabulary = vocabulary['Vocabulary'].trim().toLowerCase();
      newVocabulary.translation = vocabulary['Translation'].trim();
      newVocabulary.level = vocabulary['Level'];
      newVocabulary.phonetic = vocabulary['Phonetic']?.trim();
      newVocabulary.pos = vocabulary['POS'].trim().toLowerCase();
      newVocabulary.lesson = lessonsMap.get(vocabulary['Name']);
      newVocabulary.topic = createdTopic;
      if (reference.referenceId) {
        newVocabulary.referenceId = reference.referenceId;
        newVocabulary.phonetic = reference.phonetic
          ? reference.phonetic
          : newVocabulary.phonetic;
        newVocabulary.type = reference.type;
      }

      await queryRunner.manager.save(newVocabulary);
    }
  }

  private async _updateLessonLevel(createdLessons: Lesson[], queryRunner: QueryRunner) {
    createdLessons.forEach(async (lesson: Lesson) => {
      const vocabulariesInLesson = await queryRunner.manager
        .createQueryBuilder(Vocabulary, 'vocabulary')
        .where('vocabulary.lessonId = :lessonId', { lessonId: lesson.id })
        .getMany();
      const totalVocabulary = vocabulariesInLesson.length;
      if (totalVocabulary > 0) {
        const sumLevel: number = vocabulariesInLesson.reduce(
          (total: number, vocabulary: Vocabulary) => {
            return total + vocabulary.level;
          },
          0
        );
        const avgLevel = sumLevel / totalVocabulary;
        lesson.level = Math.round(avgLevel);
        return await queryRunner.manager.save(lesson);
      }
    });

  }

  async createTopic(createTopicInput: CreateTopicInput) {
    const { name, specializationId } = createTopicInput;
    const specialization = await this._connection
      .getRepository(Specialization)
      .findOne(specializationId);
    if (!specialization)
      throw new exceptions.NotFoundError('Not found', this._logger);
    const isExistTopic = await this._topicRepository.findOne({
      where: {
        name,
      },
    });
    if (isExistTopic)
      throw new exceptions.ConflictError('Topic has been exist', this._logger);

    try {
      const topic = this._topicRepository.create(createTopicInput);
      topic.specialization = specialization;
      return this._topicRepository.save(topic);
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Internal server',
        this._logger,
        error
      );
    }
  }

  async getTopics(getTopicsArgs: GetTopicsArgs, cache: BaseRedisCache ) {
    const query = this._topicRepository
      .createQueryBuilder('topic')
      .select()
      .orderBy('topic.name', 'ASC');
      
    Object.keys(getTopicsArgs).forEach(key => {
      if (Array.isArray(getTopicsArgs[key]) && getTopicsArgs[key].length === 0) {
        delete getTopicsArgs[key];
      }
      if(getTopicsArgs[key] === '') {
        delete getTopicsArgs[key];
      }
    });
    if (getTopicsArgs.category) {
      query.andWhere('topic.categoryId = :categoryId', {
        categoryId: getTopicsArgs.category,
      });
    }

    if (getTopicsArgs.specs && getTopicsArgs.specs.length > 0) {
      query.andWhere('topic.specializationId IN (:...specializationIds)', {
        specializationIds: getTopicsArgs.specs,
      });
    }

    if (getTopicsArgs.name) {
      //* remove accent, ILIKE case-insensitive
      query.andWhere('unaccent(topic.name) ILIKE unaccent(:name) ', {
        name: `%${getTopicsArgs.name}%`,
      });
    }
    const cacheConditions = ['pageNumber', 'limit', 'category'];

    return pagination.offset.paginate(query, getTopicsArgs, cache, 24 * 60 * 60, cacheConditions);
  }

  async getMyTopics(identity: Identity) {
    // do something important
    const infoUser = await this._connection.getRepository(User).findOne({
      identityId: identity.account.id,
    });
    const myEnrollments: Enrollment[] = await this._connection
      .getRepository(Enrollment)
      .find({
        where: {
          userId: infoUser.id,
        },
        relations: ['topic'],
      });
    const topics = myEnrollments.map((enrollment: Enrollment) => ({
      ...enrollment.topic,
      students: [_.omit(enrollment, ['topic'])],
    }));
    return topics;
  }

  async getMyTopicDetails(getMyTopicDetailsArgs: GetMyTopicDetailsArgs) {
    const myEnrollments: Enrollment[] = await this._connection
      .getRepository(Enrollment)
      .find({
        where: {
          id: In(getMyTopicDetailsArgs.studentIds),
        },
        relations: ['topic'],
      });
    const topics = myEnrollments.map(async (enrollment: Enrollment) => {
      const memoryAnalyses = await this._connection
        .getRepository(MemoryAnalysis)
        .find({
          where: {
            studentId: enrollment.id,
          },
          relations: ['actualSkills', 'actualSkills.skill'],
        });
      const summarySkill = memoryAnalyses.reduce(
        (total, memoryAnalysis) => {
          memoryAnalysis.actualSkills.forEach((actualSkill) => {
            if (actualSkill.percent >= 0.5) {
              total[actualSkill.skill.name]['good'] = ++total[
                actualSkill.skill.name
              ]['good'];
            }
            if (actualSkill.percent < 0.5 && actualSkill.percent > 0.19) {
              total[actualSkill.skill.name]['medium'] = ++total[
                actualSkill.skill.name
              ]['medium'];
            }
            if (actualSkill.percent <= 0.19) {
              total[actualSkill.skill.name]['bad'] = ++total[
                actualSkill.skill.name
              ]['bad'];
            }
          });
          return total;
        },
        {
          writing: {
            good: 0,
            medium: 0,
            bad: 0,
          },
          speaking: {
            good: 0,
            medium: 0,
            bad: 0,
          },
          reading: {
            good: 0,
            medium: 0,
            bad: 0,
          },
          listening: {
            good: 0,
            medium: 0,
            bad: 0,
          },
        }
      );
      enrollment.memoryFluctuations = {
        memorized: 0,
        vague: 0,
        forgot: 0,
      };
      if (memoryAnalyses.length > 0) {
        const maxLastStudiedAt = memoryAnalyses
          .filter(
            (item) =>
              moment(item.lastStudiedAt).format('YYYY-MM-DD') !==
              moment().format('YYYY-MM-DD')
          )
          .reduce((pre, current) => {
            if (current.lastStudiedAt.getTime() > pre.getTime())
              pre = current.lastStudiedAt;
            return pre;
          }, memoryAnalyses[0].lastStudiedAt);
        enrollment.memoryFluctuations = await this._calcMemoryFluctuations(
          memoryAnalyses,
          maxLastStudiedAt
        );
      }
      enrollment.summarySkill = summarySkill;
      return {
        ...enrollment.topic,
        students: [_.omit(enrollment, ['topic'])],
      };
    });
    return topics;
  }
  //* For loader
  async getTopicsByIds(ids: string[]) {
    return this._topicRepository.findByIds(ids);
  }

  async deleteTopicsByIds(ids: string[]) {
    let affected = 0;
    for (let index = 0; index < ids.length; index++) {
      const topic = await this._topicRepository.findOne(
        { id: ids[index] },
        {
          relations: ['lessons'], //* must have relation to auto delete related children
        }
      );
      if (!topic) throw new exceptions.NotFoundError('Not found', this._logger);
      this._topicRepository.softRemove(topic);
      affected += 1;
    }
    return {
      affected: affected,
    };
  }

  async restoreTopicsByIds(ids: string[]) {
    let affected = 0;
    for (let index = 0; index < ids.length; index++) {
      const topic = await this._topicRepository.findOne(
        { id: ids[index] },
        { withDeleted: true, relations: ['lessons'] } //* must have relation to auto restore related children
      );
      if (!topic) throw new exceptions.NotFoundError('Not found', this._logger);
      this._topicRepository.recover(topic);
      affected += 1;
    }
    return {
      affected: affected,
    };
  }

  async importTopic(fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer, {
      type: 'buffer',
      cellDates: true,
    });

    const masterWs = workbook.Sheets[workbook.SheetNames[0]];
    if (!masterWs)
      throw new exceptions.BadRequestError(
        'Sheet master does not exist',
        this._logger
      );

    //! CPU intensive
    const topics = XLSX.utils
      .sheet_to_json(masterWs, { defval: '' })
      .map((topic: any) => ({
        name: topic['Name'].trim(),
        thumbnail: topic['Thumbnail'].trim(),
        fromLang: topic['From language'].trim(),
        learningLang: topic['Learning language'].trim(),
        status: topic['Status'].trim(),
        spec: topic['Specialization'].trim(),
        category: topic['Category'].trim(),
      }));
    const newTopics = [];
    const updateTopics = [];
    topics.forEach((topic: any) => {
      if (topic.status === 'New') {
        newTopics.push(topic);
      }
      if (topic.status === 'Update') {
        updateTopics.push(topic);
      }
    });
    if (newTopics.length > 0) {
      this._createTopics(newTopics, workbook);
    }
    if (updateTopics.length > 0) {
      this._updateTopics(updateTopics, workbook);
    }
    return;
  }

  private async _createTopics(newTopics: any[], workbook: XLSX.WorkBook) {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let index = 0; index < newTopics.length; index++) {
        //* TOPIC
        const topic = newTopics[index];
        const newTopic = this._topicRepository.create();

        const infoFromLang = (await this._connection
          .getRepository(BaseLang)
          .findOne({
            name: topic.fromLang.toLowerCase(),
          })) as Language;

        const infoLearningLang = (await this._connection
          .getRepository(BaseLang)
          .findOne({
            name: topic.learningLang.toLowerCase(),
          })) as Language;

        const infoCategory = await this._connection
          .getRepository(Category)
          .findOne({
            where: {
              name: topic.category,
            },
            relations: ['specializations'],
          });
        if (!infoFromLang || !infoLearningLang || !infoCategory)
          throw new exceptions.BadRequestError(
            'Not found Language || Category',
            this._logger
          );

        const infoSpec = infoCategory.specializations.find(
          (spec: Specialization) => spec.name.trim() === topic.spec.trim()
        );
        if (!infoSpec)
          throw new exceptions.NotFoundError(
            `Not found ${topic.spec} in ${topic.category}`,
            this._logger
          );

        const sheetTopicIndex = workbook.SheetNames.findIndex(
          (sheetName) => sheetName.trim() === topic.name.trim()
        );
        if (sheetTopicIndex < 0)
          throw new exceptions.BadRequestError(
            `Sheet ${topic.name} does not exist`,
            this._logger
          );
        const DIR = `topic/${StringUtil.normalize(
          infoCategory.name
        ).toLowerCase()}/${StringUtil.normalize(
          infoSpec.name
        ).toLowerCase()}/${StringUtil.normalize(topic.name).toLowerCase()}`;

        //* TOPIC
        newTopic.name = topic.name.trim();
        //TODO review
        newTopic.thumbnailUri = `${process.env.MINIO_PUBLIC_HOST}/${process.env.MINIO_BUCKET_NAME}/resources/${DIR}/thumbnail/thumbnail.jpg`;
        newTopic.learningLang = infoLearningLang;
        newTopic.fromLang = infoFromLang;
        newTopic.specialization = infoSpec;
        newTopic.category = infoCategory;
        const createdTopic = await queryRunner.manager.save(newTopic);

        // if (topic.thumbnail) {
        //   const response = await axios.get(topic.thumbnail, {
        //     responseType: 'arraybuffer',
        //   });
        //   const buffer = Buffer.from(response.data, 'utf-8');
        //   this._minIoService.uploadFile(
        //     process.env.MINIO_BUCKET_NAME,
        //     `${DIR}/thumbnail/thumbnail.jpg`,
        //     'image/jpg',
        //     buffer
        //   );
        // }
        //* LESSON AND VOCABULARY

        const ws = workbook.Sheets[workbook.SheetNames[sheetTopicIndex]];
        const temp1 = _.cloneDeep(ws); //* avoid reference
        //* check empty topic
        if (!temp1['!ref']) {
          await queryRunner.commitTransaction();
          continue;
        }
        const lessonRange = XLSX.utils.decode_range(temp1['!ref']);

        lessonRange.s.r = 2;
        lessonRange.e.c = 5;
        temp1['!ref'] = XLSX.utils.encode_range(lessonRange);

        const vocabularies = XLSX.utils.sheet_to_json(temp1, { defval: '' });

        const lessons = [...new Set(vocabularies.map((i: any) => i['Name']))];
        const createLessonsPromises = lessons.map((lesson: string) => {
          const newLesson = this._connection.getRepository(Lesson).create();
          newLesson.name = lesson;
          newLesson.topic = createdTopic;
          return queryRunner.manager.save(newLesson);
        });
        const createdLessons = await Promise.all(createLessonsPromises);
        const lessonsMap = new Map(
          createdLessons.map((lesson) => [lesson.name, lesson])
        );

        await this._createVocabularies(
          vocabularies,
          createdTopic,
          lessonsMap,
          queryRunner
        );

        //* calc lesson'level
        await this._updateLessonLevel(createdLessons, queryRunner);
        
        //* QUESTION
        await this._questionService.generateQuestionsByTopicId(
          createdTopic.id,
          queryRunner
        );
      }
      this._logger.debug('saved');

      await queryRunner.commitTransaction();
    } catch (error) {
      this._logger.error(error);
      await queryRunner.rollbackTransaction();
      return 'error';
    } finally {
      await queryRunner.release();
    }
  }

  //! deprecated
  private async _updateTopics(updateTopics: any[], workbook: XLSX.WorkBook) {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let index = 0; index < updateTopics.length; index++) {
        //* TOPIC
        const topic = updateTopics[index];
        const infoTopic = await this._topicRepository.findOne({
          name: topic.name,
        });
        if (!infoTopic)
          throw new exceptions.NotFoundError('Not found topic', this._logger);

        const infoFromLang = await this._connection
          .getRepository(Language)
          .findOne({
            name: topic.fromLang.toLowerCase(),
          });
        if (!infoFromLang)
          throw new exceptions.NotFoundError(
            'Not found Language',
            this._logger
          );

        const infoLearningLang = await this._connection
          .getRepository(Language)
          .findOne({
            name: topic.learningLang.toLowerCase(),
          });
        if (!infoLearningLang)
          throw new exceptions.NotFoundError(
            'Not found Language',
            this._logger
          );

        const infoCategory = await this._connection
          .getRepository(Category)
          .findOne({
            where: {
              name: topic.category,
            },
            relations: ['specializations'],
          });
        if (!infoCategory)
          throw new exceptions.NotFoundError(
            'Not found category',
            this._logger
          );

        const infoSpec = infoCategory.specializations.find(
          (spec: Specialization) => spec.name === topic.spec
        );
        if (!infoSpec)
          throw new exceptions.NotFoundError(
            `Not found ${topic.spec} in ${topic.category}`,
            this._logger
          );
        const sheetTopicIndex = workbook.SheetNames.findIndex(
          (sheetName) => sheetName === topic.name
        );
        if (sheetTopicIndex < 0)
          throw new exceptions.BadRequestError(
            `Sheet ${topic.name} does not exist`,
            this._logger
          );
        const DIR = `topic/${StringUtil.normalize(
          infoCategory.name
        ).toLowerCase()}/${StringUtil.normalize(
          infoSpec.name
        ).toLowerCase()}/${StringUtil.normalize(infoTopic.name).toLowerCase()}`;

        infoTopic.name = topic.name;
        infoTopic.learningLang = infoLearningLang;
        infoTopic.fromLang = infoFromLang;
        infoTopic.specialization = infoSpec;
        infoTopic.category = infoCategory;
        const updatedTopic = await queryRunner.manager.save(infoTopic);
        if (topic.thumbnail) {
          const response = await axios.get(topic.thumbnail, {
            responseType: 'arraybuffer',
          });
          const buffer = Buffer.from(response.data, 'utf-8');
          this._minIoService.uploadFile(
            DIR,
            'thumbnail.png',
            'image/png',
            buffer
          );
        }
        //* LESSON AND VOCABULARY
        const ws = workbook.Sheets[workbook.SheetNames[sheetTopicIndex]];
        const temp1 = _.cloneDeep(ws); //* avoid reference
        const lessonRange = XLSX.utils.decode_range(temp1['!ref']);
        lessonRange.s.r = 2;
        lessonRange.e.c = 5;
        temp1['!ref'] = XLSX.utils.encode_range(lessonRange);

        const vocabularies = XLSX.utils.sheet_to_json(temp1, { defval: '' });
        const lessons = [...new Set(vocabularies.map((i: any) => i['Name']))];
        const updateLessonsPromises = lessons.map(async (lesson: string) => {
          const infoLesson = await this._connection
            .getRepository(Lesson)
            .findOne({ name: lesson });

          if (!infoLesson) {
            const newLesson = this._connection.getRepository(Lesson).create();
            newLesson.name = lesson;
            newLesson.topic = updatedTopic;
            return queryRunner.manager.save(newLesson);
          } else {
            infoLesson.topic = updatedTopic;
            return queryRunner.manager.save(infoLesson);
          }
        });
        const updatedLessons = await Promise.all(updateLessonsPromises);
        const lessonsMap = new Map(
          updatedLessons.map((lesson) => [lesson.name, lesson])
        );

        const updateVocabularyPromises = vocabularies.map(
          async (vocabulary: any) => {
            const infoVocabulary = await this._connection
              .getRepository(Vocabulary)
              .findOne({
                where: {
                  vocabulary: vocabulary['Vocabulary'].trim(),
                  pos: vocabulary['POS'].trim(),
                  topic: {
                    name: topic.name,
                  },
                },
                relations: ['topic'],
              });
            if (!infoVocabulary) {
              const reference = await this._dictionaryGrpcServiceClient.getReference({
                vocabulary: vocabulary['Vocabulary'].trim(),
                langCode: 'en',
                pos: vocabulary['POS'].trim(),
              });
              const newVocabulary = this._connection
                .getRepository(Vocabulary)
                .create();
              newVocabulary.vocabulary = vocabulary['Vocabulary']
                .trim()
                .toLowerCase();
              newVocabulary.translation = vocabulary['Translation'].trim();
              newVocabulary.phonetic = vocabulary['Phonetic'].trim() || '';
              newVocabulary.pos = vocabulary['POS'].trim().toLowerCase();
              newVocabulary.lesson = lessonsMap.get(vocabulary['Name']);
              newVocabulary.topic = updatedTopic;
              if (reference) {
                newVocabulary.referenceId = reference.referenceId;
                newVocabulary.phonetic = reference.phonetic
                  ? reference.phonetic
                  : newVocabulary.phonetic;
                newVocabulary.type = reference.type;
              }
              const createdNewVocabulary = await queryRunner.manager.save(
                newVocabulary
              );

              const newResource = this._connection
                .getRepository(Resource)
                .create();
              newResource.category = ResourceCategory.audio;
              newResource.uri = `${process.env.MINIO_PUBLIC_HOST}/${
                process.env.MINIO_BUCKET_NAME
              }/${DIR}/audio/${newVocabulary.vocabulary.replace(
                /\s/g,
                '_'
              )}.mp3`;
              newResource.isWord = true;
              newResource.vocabularyId = createdNewVocabulary.id;
              await queryRunner.manager.save(newResource);

              //TODO upload file
              this._resourceQueueService.textToSpeak(
                `${DIR}/audio`,
                createdNewVocabulary.vocabulary,
                newResource.id
              );
              return createdNewVocabulary;
            } else {
              infoVocabulary.vocabulary = vocabulary['Vocabulary'].trim();
              infoVocabulary.translation = vocabulary['Translation'].trim();
              infoVocabulary.phonetic = vocabulary['Phonetic'];
              infoVocabulary.pos = vocabulary['POS'].trim();
              infoVocabulary.lesson = lessonsMap.get(vocabulary['Name']);
              infoVocabulary.topic = updatedTopic;
              return queryRunner.manager.save(infoVocabulary);
            }
          }
        );
        const updatedVocabularies = await Promise.all(updateVocabularyPromises);
        const vocabulariesMap = new Map(
          updatedVocabularies.map((vocabulary: Vocabulary) => [
            vocabulary.vocabulary + '_' + vocabulary.pos,
            vocabulary,
          ])
        );
        //* RESOURCE
        const temp2 = _.cloneDeep(ws); //* avoid reference
        const resourceRange = XLSX.utils.decode_range(temp2['!ref']);
        resourceRange.s.r = 2;
        resourceRange.s.c = 7;
        temp2['!ref'] = XLSX.utils.encode_range(resourceRange);
        const resources = XLSX.utils.sheet_to_json(temp2, { defval: '' });
        //* delete old resource and override
        await this._connection.getRepository(Resource).delete({
          vocabularyId: In(updatedVocabularies.map((item) => item.id)),
        });
        const createResourcePromises = resources.map(async (rs: any) => {
          const newResource = this._connection.getRepository(Resource).create();
          newResource.category = rs['Category'];
          newResource.transcript = rs['Transcript'];
          newResource.translation = rs['Translation'];
          newResource.uri = rs['Uri'];
          newResource.isWord = Boolean(rs['Is Word']);
          newResource.vocabulary = vocabulariesMap.get(
            rs['Vocabulary'] + '_' + rs['POS']
          );
          if (
            newResource.category === ResourceCategory.audio &&
            !newResource.isWord &&
            !newResource.uri
          ) {
            const fileName = `${newResource.vocabulary.vocabulary}-sentence-${index}`;

            this._textToSpeechService.sentenceToSpeech(
              `${DIR}/audio`,
              newResource.transcript,
              fileName
            );
            newResource.uri = `${process.env.MINIO_PUBLIC_HOST}/${process.env.MINIO_BUCKET_NAME}/${DIR}/audio/${fileName}.mp3`;
            newResource.isWord = true;
          }
          return queryRunner.manager.save(newResource);
        });
        await Promise.all(createResourcePromises);
        //* QUESTIONS
        const prompts = await this._connection.getRepository(Prompt).find({
          where: {
            question: {
              vocabularyId: In(updatedVocabularies.map((i) => i.id)),
            },
          },
          relations: ['question'],
        });
        this._connection.getRepository(Prompt).remove(prompts);

        await this._questionService.generateQuestionsByTopicId(
          updatedTopic.id,
          queryRunner
        );
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      this._logger.error(error);
      await queryRunner.rollbackTransaction();
      return 'error';
    } finally {
      await queryRunner.release();
    }
  }

  //* Sap xep topic quen nhieu nhat
  private _sortMostForgotTopic(listTopicToSort: any[]) {
    let mostTopic;
    listTopicToSort.forEach((item) => {
      if (!mostTopic) {
        mostTopic = item;
      } else {
        if (item.value > mostTopic.value) {
          mostTopic = item;
        } else {
          if (item.value === mostTopic.value) {
            if (item.topic.name < mostTopic.topic.name) {
              mostTopic = item;
            }
          }
        }
      }
    });
    return mostTopic.topic;
  }

  //* Xu ly tu da quen > 50%
  private async _handleWordsForgotMore50(listForgot: MemoryAnalysis[]){
    const listTopicToSort = [];
    listForgot.forEach((item) => {
      if (listTopicToSort.length > 0) {
        let idExisted = false;
        listTopicToSort.forEach((element) => {
          if (element.topic.id === item.student.topic.id) {
            element.value += 1;
            idExisted = true;
          }
        });
        if (!idExisted) {
          listTopicToSort.push({
            topic: item.student.topic,
            value: 1,
          });
        }
      } else {
        listTopicToSort.push({
          topic: item.student.topic,
          value: 1,
        });
      }
    });

    //* Sort most topic
    return this._sortMostForgotTopic(listTopicToSort);
  }

  //* Xu ly tu da quen <= 50%
  private async _handleWordsForgotLess50(memoryAnalysis: MemoryAnalysis[]){
    let lastActivity;
    memoryAnalysis.forEach((item) => {
      if (!lastActivity) {
        lastActivity = item.student;
      } else {
        if (item.student.lastActivityAt > lastActivity.lastActivityAt) {
          lastActivity = item.student;
        }
      }
    });
    return lastActivity.topic;
  }

  //TODO Landon refactor
  async checkVocabularyMemorized(identity: Identity) {
    const user = await this._connection.getRepository(User).findOne({
      where: {
        identityId: identity.account?.id,
      },
    });

    const memoryAnalysis = await this._connection
      .getRepository(MemoryAnalysis)
      .createQueryBuilder('memoryAnalysis')
      .leftJoinAndSelect('memoryAnalysis.student', 'student')
      .leftJoinAndSelect('student.topic', 'topic')
      .leftJoinAndSelect('student.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    const listForgot = memoryAnalysis.filter((item) => {
      if (item.memoryStatus === MemoryStatus.forgot) {
        return true;
      }
      return false;
    });
    if (memoryAnalysis.length > 0) {
      //* Xu ly truong hop tu da quen > 50%
      if ((listForgot.length / memoryAnalysis.length) * 100 > 50) {
        return await this._handleWordsForgotMore50(listForgot);
      }
      //* Xu ly truong hop tu da quen <= 50%
      return this._handleWordsForgotLess50(memoryAnalysis);
    }
    return null;
  }

  async getActualSkillHistories(
    getActualSkillHistoryArgs: GetActualSkillHistoryArgs
  ) {
    const [infoStudentData] = await trycat(
      this._connection
        .getRepository(Enrollment)
        .findOne({ id: getActualSkillHistoryArgs.studentId })
    );
    if (!infoStudentData)
      throw new exceptions.NotFoundError('Not found student', this._logger);
    const infoStudent: Enrollment = infoStudentData;

    const [infoSkillData] = await trycat(
      this._connection.getRepository(Skill).findOne({
        where: {
          name: getActualSkillHistoryArgs.skill,
        },
      })
    );
    if (!infoSkillData)
      throw new exceptions.BadRequestError('Invalid skill', this._logger);

    const infoSkill: Skill = infoSkillData;
    const query = this._connection
      .getRepository(ActualSkillHistory)
      .createQueryBuilder('actualSkillHistory')
      .select('actualSkillHistory.createdAt')
      .innerJoinAndSelect('actualSkillHistory.memoryAnalysis', 'memoryAnalysis')
      .andWhere('memoryAnalysis.studentId = :studentId', {
        studentId: getActualSkillHistoryArgs.studentId,
      })
      .andWhere('actualSkillHistory.skillId = :skillId', {
        skillId: infoSkill.id,
      })
      .andWhere('actualSkillHistory.percent > :percent', { percent: 0.5 });

    const response = {
      data: {},
      total: 0,
    };
    switch (getActualSkillHistoryArgs.period) {
      case 'recently': {
        const startDate = moment().subtract(6, 'days').startOf('date');
        const endDate = moment().subtract(1, 'days').endOf('date');

        const currentDateData = await this._connection
          .getRepository(ActualSkill)
          .createQueryBuilder('actualSkill')
          .andWhere('actualSkill.skillId = :skillId', {
            skillId: infoSkill.id,
          })
          .andWhere('actualSkill.percent > :percent', { percent: 0.5 })
          .andWhere('actualSkill.updatedAt > :startTime', {
            startTime: moment().startOf('date'),
          })
          .innerJoinAndSelect('actualSkill.memoryAnalysis', 'memoryAnalysis')
          .andWhere('memoryAnalysis.studentId = :studentId', {
            studentId: getActualSkillHistoryArgs.studentId,
          })
          .getCount();

        query.andWhere(
          'actualSkillHistory.createdAt BETWEEN :startDate and :endDate ',
          { startDate, endDate }
        );
        const actualSkillHistories = await query.getMany();
        const listDates = DateUtil.getDates(
          startDate.toDate(),
          endDate.toDate()
        );
        const rs = listDates.reduce((pre, date) => {
          pre[date] = actualSkillHistories.filter(
            (history: ActualSkillHistory) =>
              moment(history.createdAt).format('YYYY-MM-DD') === date
          ).length;
          return pre;
        }, {});
        rs[moment().format('YYYY-MM-DD')] = currentDateData;
        response.data = Object.keys(rs).map((key) => ({
          value: rs[key],
          label: key,
        }));
        break;
      }
      case '30_days_ago': {
        const startDate = moment().subtract(29, 'days').startOf('date');
        const endDate = moment().subtract(1, 'days').endOf('date');

        const currentDateData = await this._connection
          .getRepository(ActualSkill)
          .createQueryBuilder('actualSkill')
          .andWhere('actualSkill.skillId = :skillId', {
            skillId: infoSkill.id,
          })
          .andWhere('actualSkill.percent > :percent', { percent: 0.5 })
          .andWhere('actualSkill.updatedAt > :startTime', {
            startTime: moment().startOf('date'),
          })
          .innerJoinAndSelect('actualSkill.memoryAnalysis', 'memoryAnalysis')
          .andWhere('memoryAnalysis.studentId = :studentId', {
            studentId: getActualSkillHistoryArgs.studentId,
          })
          .getCount();

        query.andWhere(
          'actualSkillHistory.createdAt BETWEEN :startDate and :endDate ',
          { startDate, endDate }
        );
        const actualSkillHistories = await query.getMany();

        const listDates = DateUtil.getDates(
          startDate.toDate(),
          endDate.toDate()
        );
        const rs = listDates.reduce((pre, date) => {
          pre[date] = actualSkillHistories.filter(
            (history: ActualSkillHistory) =>
              moment(history.createdAt).format('YYYY-MM-DD') === date
          ).length;
          return pre;
        }, {});
        rs[moment().format('YYYY-MM-DD')] = currentDateData;
        response.data = Object.keys(rs).map((key) => ({
          value: rs[key],
          label: key,
        }));
        break;
      }
      case 'one_year_ago': {
        const startDate = moment().subtract(1, 'years').startOf('date');
        const endDate = moment().subtract(1, 'days').endOf('date');

        const currentDateData = await this._connection
          .getRepository(ActualSkill)
          .createQueryBuilder('actualSkill')
          .andWhere('actualSkill.skillId = :skillId', {
            skillId: infoSkill.id,
          })
          .andWhere('actualSkill.percent > :percent', { percent: 0.5 })
          .andWhere('actualSkill.updatedAt > :startTime', {
            startTime: moment().startOf('date'),
          })
          .innerJoinAndSelect('actualSkill.memoryAnalysis', 'memoryAnalysis')
          .andWhere('memoryAnalysis.studentId = :studentId', {
            studentId: getActualSkillHistoryArgs.studentId,
          })
          .getCount();
        query.andWhere(
          'actualSkillHistory.createdAt BETWEEN :startDate and :endDate ',
          { startDate, endDate }
        );

        const actualSkillHistories = await query.getMany();
        const listDates = DateUtil.getDates(
          startDate.toDate(),
          endDate.toDate()
        );
        const rs = listDates.reduce((pre, date) => {
          pre[date] = actualSkillHistories.filter(
            (history: ActualSkillHistory) =>
              moment(history.createdAt).format('YYYY-MM-DD') === date
          ).length;
          return pre;
        }, {});
        rs[moment().format('YYYY-MM-DD')] =
          currentDateData + rs[moment().format('YYYY-MM-DD')];
        response.data = Object.keys(rs).map((key) => ({
          value: rs[key],
          label: key,
        }));

        break;
      }
      default:
        break;
    }
    response.total = await this._connection.getRepository(Vocabulary).count({
      where: {
        topicId: infoStudent.topicId,
      },
    });
    return response;
  }

  async uploadMissedAudio() {
    // const missedResources = await this._connection
    //   .getRepository(Resource)
    //   .find({
    //     where: {
    //       status: ResourceStatus.out_of_sync,
    //     },
    //     relations: [
    //       'vocabulary',
    //       'vocabulary.topic',
    //       'vocabulary.topic.category',
    //       'vocabulary.topic.specialization',
    //     ],
    //   });
    // missedResources.forEach((rs) => {
    //   const dir = `/topic/${StringUtil.normalize(
    //     rs.vocabulary.topic.category.name
    //   ).toLowerCase()}/${StringUtil.normalize(
    //     rs.vocabulary.topic.specialization.name
    //   ).toLowerCase()}/${StringUtil.normalize(
    //     rs.vocabulary.topic.name
    //   ).toLowerCase()}/audio`;

    //   this._resourceQueueService.textToSpeak(
    //     rs.vocabulary.vocabulary,
    //     dir,
    //     rs.id
    //   );
    // });
    return 'success';
  }

  async countParticipants(topicId: string) {
    return this._connection
      .getRepository(Enrollment)
      .count({ topicId: topicId });
  }

  async syncThumbnailTopic(syncThumbnailTopicInput: SyncThumbnailTopicInput) {
    const infoTopic = await this._topicRepository.findOne({
      where: {
        id: syncThumbnailTopicInput.topicId,
        categoryId: Not(IsNull()),
        specializationId: Not(IsNull()),
      },
      relations: ['category', 'specialization'],
    });
    if (!infoTopic || !infoTopic.category || !infoTopic.specialization)
      throw new exceptions.NotFoundError('Topic is invalid', this._logger);

    const prefix = `topic/${StringUtil.normalize(
      infoTopic.category.name.toLowerCase()
    )}/${StringUtil.normalize(
      infoTopic.specialization.name.toLowerCase()
    )}/${StringUtil.normalize(infoTopic.name.toLowerCase())}/thumbnail`;

    const listObjects = await this._minIoService.listObjects(
      'resources',
      prefix
    );
    if (listObjects.length > 0) {
      infoTopic.thumbnailUri = `${process.env.MINIO_PUBLIC_HOST}/${
        process.env.MINIO_BUCKET_NAME
      }/${prefix}/thumbnail.jpg`;
      return this._topicRepository.save(infoTopic);
    }

  }
}

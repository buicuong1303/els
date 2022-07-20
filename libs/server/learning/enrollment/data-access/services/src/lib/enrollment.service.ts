/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AmqpNotificationService } from '@els/server/learning/amqp';
import {
  MemoryStatus,
  NotificationType,
  QuestionType,
  UnTrackingMode
} from '@els/server/learning/common';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import {
  CreateEnrollmentInput,
  LearnVocabularyInput,
  UnTrackVocabularyInput,
  UpdateMemoryAnalysisInput
} from '@els/server/learning/enrollment/data-access/types';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import {
  ActualSkill,
  MemoryAnalysis,
  MemoryAnalysisEnrollment
} from '@els/server/learning/memory-analysis/data-access/entities';
import { Question } from '@els/server/learning/question/data-access/entities';
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities';
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { User } from '@els/server/learning/user/data-access/entities';
import { UserService } from '@els/server/learning/user/data-access/services';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { exceptions, Identity } from '@els/server/shared';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Connection, In, QueryRunner, Repository } from 'typeorm';

export class EnrollmentService {
  private readonly _logger = new Logger(EnrollmentService.name);
  private readonly DISTANCE = 18;
  private readonly MAX_LEVEL = 9;
  private readonly EXP_COEFFICIENT = 10;
  private readonly SKILL_POINT: any = {
    reading: 1,
    writing: 1,
    listening: 2,
    speaking: 2,
  };
  constructor(
    @InjectRepository(Enrollment)
    private readonly _enrollmentRepository: Repository<Enrollment>,
    private readonly _notificationService: AmqpNotificationService,
    private readonly _userService: UserService,
    private readonly _connection: Connection
  ) {}
  private async _unTrackVocabularySystem(
    infoStudent: Enrollment,
    infoVocabulary: Vocabulary,
    unTrackingMode: UnTrackingMode
  ) {

    const ignoredWords = new Set(infoStudent.user.ignoredWords);
    ignoredWords.add(infoVocabulary.vocabulary);

    infoStudent.user.ignoredWords = [...ignoredWords];
    await this._connection.getRepository(User).save(infoStudent.user);
    //* find vocabulary in other enrollments and update its memory analysis 
    const enrollments = await this._enrollmentRepository
      .createQueryBuilder('enrollment')
      .innerJoinAndSelect('enrollment.topic', 'topic')
      .innerJoinAndSelect('topic.vocabularies', 'vocabularies')
      .innerJoinAndSelect('vocabularies.lesson', 'lesson')
      .where(
        'enrollment.id != :currentEnrollmentId and enrollment.userId = :userId',
        {
          currentEnrollmentId: infoStudent.id,
          userId: infoStudent.userId,
        }
      )
      .getMany();
    enrollments.forEach(async (enrollment: Enrollment) => {
      if (
        !enrollment.topic.vocabularies ||
        enrollment.topic.vocabularies.length === 0
      )
        return;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (
        let index = 0;
        index < enrollment.topic.vocabularies.length;
        index++
      ) {
        const vocabulary = enrollment.topic.vocabularies[index];
        if (vocabulary.vocabulary === infoVocabulary.vocabulary) {
          const infoMemoryAnalysis = await this._connection
            .getRepository(MemoryAnalysis)
            .findOne({
              where: {
                vocabularyId: vocabulary.id,
                studentId: enrollment.id,
                lessonId: vocabulary.lessonId,
              },
            });
          if (infoMemoryAnalysis) {
            infoMemoryAnalysis.unTrackingMode = unTrackingMode;
            infoMemoryAnalysis.memoryStatus = MemoryStatus.memorized;
            return await this._connection
              .getRepository(MemoryAnalysis)
              .save(infoMemoryAnalysis);
          }
          //* new vocabulary
          const newMemoryAnalysis = this._connection
            .getRepository(MemoryAnalysis)
            .create();
          newMemoryAnalysis.student = enrollment;
          newMemoryAnalysis.vocabulary = vocabulary;
          newMemoryAnalysis.lesson = vocabulary.lesson;
          newMemoryAnalysis.memoryStatus = MemoryStatus.memorized;
          newMemoryAnalysis.unTrackingMode = unTrackingMode;
          newMemoryAnalysis.lastStudiedAt = new Date();
          this._connection
            .getRepository(MemoryAnalysis)
            .save(newMemoryAnalysis);
          break;
        }
      }
    });
  }

  private async _updateActualSkills(
    infoQuestion: Question,
    infoMemoryAnalysis: MemoryAnalysis,
    queryRunner: QueryRunner
  ) {
    for (const skill of ['reading', 'listening', 'writing', 'speaking']) {
      //* check skill is related in question
      if (infoQuestion.skills?.includes(skill)) {
        const actualSkill = await this._connection
          .getRepository(ActualSkill)
          .createQueryBuilder('actualSkill')
          .innerJoinAndSelect('actualSkill.skill', 'skill')
          .andWhere('skill.name = :skillName', { skillName: skill })
          .andWhere('actualSkill.memoryAnalysisId = :memoryAnalysisId', {
            memoryAnalysisId: infoMemoryAnalysis.id,
          })
          .getOne();
        if (!actualSkill) continue;
        //* reset percent
        actualSkill.percent = 1;
        actualSkill.updatedAt = new Date();
        //* if the distance between now and last level up is more than 18 hours, level up skill
        if (
          moment().diff(actualSkill.levelUpAt, 'hours') > this.DISTANCE &&
          actualSkill.currentLevel < this.MAX_LEVEL
        ) {
          actualSkill.currentLevel += 1;
          actualSkill.levelUpAt = new Date();

          const skillLevel = await this._connection
            .getRepository(SkillLevel)
            .createQueryBuilder('skillLevel')
            .innerJoinAndSelect('skillLevel.level', 'level')
            .andWhere('level.level = :currentLevel', {
              currentLevel: actualSkill.currentLevel,
            })
            .andWhere('skillLevel.skillId = :skillId', {
              skillId: actualSkill.skill.id,
            })
            .getOne();
          if (skillLevel) actualSkill.skillLevel = skillLevel;
        }
        await queryRunner.manager.save(actualSkill);
      }
      continue;
    }
  }
  
  private async _reviseVocabulary(
    infoMemoryAnalysis: MemoryAnalysis,
    skills: string[],
    queryRunner: QueryRunner
  ) {
    const actualSkills = await this._connection
      .getRepository(ActualSkill)
      .find({
        where: {
          memoryAnalysisId: infoMemoryAnalysis.id,
        },
        relations: ['skillLevel', 'skill'],
      });
    //* save the time when the memory analysis was changed
    if (infoMemoryAnalysis.memoryStatus !== MemoryStatus.memorized) {
      infoMemoryAnalysis.lastChangedMemoryStatusAt = new Date();
    }
    infoMemoryAnalysis.isFirstTime = false;
    infoMemoryAnalysis.memoryStatus = MemoryStatus.memorized;
    infoMemoryAnalysis.lastStudiedAt = new Date();
    await queryRunner.manager.save(infoMemoryAnalysis);
    if (actualSkills) {
      const updateActualSkillPromise = actualSkills.map(async (actualSkill) => {
        if (skills.includes(actualSkill.skill.name)) {
          actualSkill.percent = 1;
          actualSkill.updatedAt = new Date();
          if (
            moment().diff(actualSkill.levelUpAt, 'hours') > this.DISTANCE &&
            actualSkill.currentLevel < this.MAX_LEVEL
          ) {
            actualSkill.currentLevel += 1;
            const skillLevel = await this._connection
              .getRepository(SkillLevel)
              .createQueryBuilder('skillLevel')
              .innerJoinAndSelect('skillLevel.level', 'level')
              .andWhere('level.level = :currentLevel', {
                currentLevel: actualSkill.currentLevel,
              })
              .andWhere('skillLevel.skillId = :skillId', {
                skillId: actualSkill.skill.id,
              })
              .getOne();
            if (skillLevel) actualSkill.skillLevel = skillLevel;
          }
          return await queryRunner.manager.save(actualSkill);
        }
        return actualSkill;
      });
      await Promise.all(updateActualSkillPromise);
    }
    return infoMemoryAnalysis;
  }

  private async _learnNewVocabulary(
    infoStudent: Enrollment,
    infoVocabulary: Vocabulary,
    infoLesson: Lesson,
    skills: string[],
    queryRunner: QueryRunner
  ) {
    const newMemoryAnalysis = this._connection
      .getRepository(MemoryAnalysis)
      .create();
    newMemoryAnalysis.student = infoStudent;
    newMemoryAnalysis.vocabulary = infoVocabulary;
    newMemoryAnalysis.lesson = infoLesson;
    newMemoryAnalysis.memoryStatus = MemoryStatus.memorized;
    newMemoryAnalysis.isFirstTime = true;
    newMemoryAnalysis.lastChangedMemoryStatusAt = new Date();
    newMemoryAnalysis.lastStudiedAt = new Date();
    const createdMemoryAnalysis = await queryRunner.manager.save(
      newMemoryAnalysis
    );
    // handle completed topic
    const numberOfLearnedVocabularies = await queryRunner.manager.count(
      MemoryAnalysis,
      {
        where: {
          studentId: infoStudent.id,
        },
      }
    );
    const numberOfVocabularies = await queryRunner.manager.count(Vocabulary, {
      where: {
        topicId: infoStudent.topicId,
      },
    });

    if (numberOfLearnedVocabularies === numberOfVocabularies) {
      infoStudent.isCompleted = true;
      this._notificationService.notify(
        NotificationType.CONGRATULATE_COMPLETED_TOPIC,
        infoStudent.userId,
        infoStudent.topicId
      );
    }

    if (numberOfLearnedVocabularies >= numberOfVocabularies / 3) {
      this._notificationService.notify(
        NotificationType.REVIEW_REQUEST,
        infoStudent.userId,
        infoStudent.topicId
      );
    }

    const listSkills = await this._connection.getRepository(Skill).find();

    const createActualSkillPromise = listSkills.map(async (skill: Skill) => {
      const newActualSkill = this._connection
        .getRepository(ActualSkill)
        .create();
      newActualSkill.skill = skill;
      newActualSkill.memoryAnalysis = createdMemoryAnalysis;
      if (skills.includes(skill.name)) {
        newActualSkill.percent = 1;
        newActualSkill.currentLevel = 1;
      } else {
        newActualSkill.percent = 0;
        newActualSkill.currentLevel = 1;
      }

      const skillLevel = await this._connection
        .getRepository(SkillLevel)
        .createQueryBuilder('skillLevel')
        .innerJoinAndSelect('skillLevel.level', 'level')
        .andWhere('level.level = :currentLevel', {
          currentLevel: newActualSkill.currentLevel,
        })
        .andWhere('skillLevel.skillId = :skillId', {
          skillId: skill.id,
        })
        .getOne();
      if (skillLevel) newActualSkill.skillLevel = skillLevel;
      return queryRunner.manager.save(newActualSkill);
    });
    await Promise.all(createActualSkillPromise);
    return createdMemoryAnalysis;
  }

  private async _testNewVocabulary(
    infoStudent: Enrollment,
    infoQuestion: Question,
    queryRunner: QueryRunner
  ) {
    const newMemoryAnalysis = this._connection
      .getRepository(MemoryAnalysis)
      .create();
    newMemoryAnalysis.student = infoStudent;
    newMemoryAnalysis.vocabulary = infoQuestion.vocabulary;
    newMemoryAnalysis.lessonId = infoQuestion.vocabulary.lessonId;
    newMemoryAnalysis.memoryStatus = MemoryStatus.memorized;
    newMemoryAnalysis.isFirstTime = true;
    newMemoryAnalysis.lastChangedMemoryStatusAt = new Date();
    newMemoryAnalysis.lastStudiedAt = new Date();
    const createdMemoryAnalysis = await queryRunner.manager.save(
      newMemoryAnalysis
    );

    //* handle completed topic
    const numberOfLearnedVocabularies = await queryRunner.manager.count(
      MemoryAnalysis,
      {
        where: {
          studentId: infoStudent.id,
        },
      }
    );
    const numberOfVocabularies = await queryRunner.manager.count(Vocabulary, {
      where: {
        topicId: infoStudent.topicId,
      },
    });

    if (numberOfLearnedVocabularies === numberOfVocabularies) {
      infoStudent.isCompleted = true;
      this._notificationService.notify(
        NotificationType.CONGRATULATE_COMPLETED_TOPIC,
        infoStudent.userId,
        infoStudent.topicId
      );
    }

    if (numberOfLearnedVocabularies >= numberOfVocabularies / 3) {
      this._notificationService.notify(
        NotificationType.REVIEW_REQUEST,
        infoStudent.userId,
        infoStudent.topicId
      );
    }

    const listSkills = await this._connection.getRepository(Skill).find();

    const createActualSkillPromise = listSkills.map(async (skill: Skill) => {
      const newActualSkill = this._connection
        .getRepository(ActualSkill)
        .create();
      newActualSkill.skill = skill;
      newActualSkill.memoryAnalysis = createdMemoryAnalysis;
      if (
        infoQuestion.skills &&
        infoQuestion.skills.includes(skill.name) 
      ) {
        newActualSkill.percent = 1;
        newActualSkill.currentLevel = 1;
      } else {
        newActualSkill.percent = 0;
        newActualSkill.currentLevel = 1;
      }

      const skillLevel = await this._connection
        .getRepository(SkillLevel)
        .createQueryBuilder('skillLevel')
        .innerJoinAndSelect('skillLevel.level', 'level')
        .andWhere('level.level = :currentLevel', {
          currentLevel: newActualSkill.currentLevel,
        })
        .andWhere('skillLevel.skillId = :skillId', {
          skillId: skill.id,
        })
        .getOne();
      if (skillLevel) newActualSkill.skillLevel = skillLevel;
      return queryRunner.manager.save(newActualSkill);
    });
    await Promise.all(createActualSkillPromise);
    return createdMemoryAnalysis;
  }
  //* enroll to a topic
  async createEnrollment(
    createEnrollmentInput: CreateEnrollmentInput,
    identity: Identity
  ) {
    const { topicId } = createEnrollmentInput;
    const infoUser = await this._connection.getRepository(User).findOne({
      identityId: identity.account?.id,
    });

    if (!infoUser)
      throw new exceptions.NotFoundError('User is not found', this._logger);
    const infoTopic = await this._connection.getRepository(Topic).findOne({
      where: {
        id: topicId,
      },
    });
    if (!infoTopic)
      throw new exceptions.NotFoundError('Topic is not found', this._logger);
    const newEnrollment = this._enrollmentRepository.create(
      createEnrollmentInput
    );
    newEnrollment.topic = infoTopic;
    newEnrollment.user = infoUser;
    newEnrollment.lastActivityAt = new Date();
    return await this._enrollmentRepository.save(newEnrollment);
  }

  async getEnrollment(topicId: string, identity: Identity) {
    const infoUser = await this._connection.getRepository(User).findOne({
      identityId: identity.account?.id,
    });
    if (!infoUser)
      throw new exceptions.NotFoundError('User is not found', this._logger);

    const infoStudent = await this._enrollmentRepository.findOne({
      where: {
        userId: infoUser.id,
        topicId: topicId,
      },
    });
    if (!infoStudent) return null;
    return infoStudent;
  }

  async findMemoryAnalysisByEnrollmentId(studentId: string) {
    return this._connection.getRepository(MemoryAnalysis).find({
      where: {
        studentId: studentId,
      },
    });
  }

  async summaryMemoryStatus(studentId: string) {
    const infoStudent = await this._enrollmentRepository.findOne(studentId);
    if (!infoStudent)
      throw new exceptions.NotFoundError('Not found', this._logger);
    const memoryAnalyses = await this._connection
      .getRepository(MemoryAnalysis)
      .find({
        where: {
          studentId: studentId,
        },
        relations: ['vocabulary', 'actualSkills'],
      });
    let newVocabularies: string[] = [];
    const forgotVocabularies: string[] = [];
    const memorizedVocabularies: string[] = [];
    const vagueVocabularies: string[] = [];

    const learnedVocabularyIds = memoryAnalyses.map(
      (item: MemoryAnalysis) => item.vocabularyId
    );
    const vocabularyQuery = this._connection
      .getRepository(Vocabulary)
      .createQueryBuilder('vocabulary')
      .where('vocabulary.topicId = :topicId', { topicId: infoStudent.topicId });
    if (learnedVocabularyIds.length > 0) {
      vocabularyQuery.andWhere(
        'vocabulary.id NOT IN (:...learnedVocabularyIds)',
        { learnedVocabularyIds }
      );
    }
    newVocabularies = await (await vocabularyQuery.getMany()).map((v: any) => v.id);
    for (const analysis of memoryAnalyses) {
      if (analysis.memoryStatus === MemoryStatus.memorized) {
        memorizedVocabularies.push(analysis.vocabulary.id);
      } else if (analysis.memoryStatus === MemoryStatus.vague) {
        vagueVocabularies.push(analysis.vocabulary.id);
      } else {
        forgotVocabularies.push(analysis.vocabulary.id);
      }
    }
    return {
      newVocabularies,
      forgotVocabularies,
      memorizedVocabularies,
      vagueVocabularies,
    };
  }

  async mySummaryMemoryStatus(userId: string) {
    const memoryAnalyses = await this._connection.manager.find(MemoryAnalysisEnrollment, { userId });
    
    const forgotVocabularies: string[] = [];
    const memorizedVocabularies: string[] = [];
    const vagueVocabularies: string[] = [];
  
    for (const analysis of memoryAnalyses) {
      if (analysis.memoryStatus === MemoryStatus.memorized) {
        memorizedVocabularies.push(analysis.vocabularyId);
      } else if (analysis.memoryStatus === MemoryStatus.vague) {
        vagueVocabularies.push(analysis.vocabularyId);
      } else {
        forgotVocabularies.push(analysis.vocabularyId);
      }
    }
    return {
      forgotVocabularies,
      memorizedVocabularies,
      vagueVocabularies,
    };
  }

  async memoryAnalysis(userId: string) {
    const memoryAnalysis = await this._connection
      .getRepository(MemoryAnalysis)
      .createQueryBuilder('memoryAnalysis')
      .leftJoinAndSelect('memoryAnalysis.student', 'enrollment')
      .leftJoinAndSelect('memoryAnalysis.vocabulary', 'vocabulary')
      .leftJoinAndSelect('enrollment.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    return memoryAnalysis;
  }

  async findByUserId(userId: string) {
    return this._enrollmentRepository.find({
      where: {
        userId: userId,
      },
      order: { lastActivityAt: 'DESC' },
    });
  }

  //* when user answer a test
  async updateMemoryAnalysis(
    updateMemoryAnalysisInput: UpdateMemoryAnalysisInput,
    identity: Identity
  ): Promise<any> {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const infoUser = await this._connection.getRepository(User).findOne({
        identityId: identity.account?.id,
      });
      if (!infoUser)
        throw new exceptions.NotFoundError('Not found user', this._logger);

      const infoQuestion = await this._connection
        .getRepository(Question)
        .findOne({
          where: {
            id: updateMemoryAnalysisInput.questionId,
          },
          relations: ['vocabulary', 'vocabulary.topic'],
        });
      if (!infoQuestion)
        throw new exceptions.NotFoundError('Not found question', this._logger);
      const infoStudent = await this._enrollmentRepository.findOne({
        where: {
          topicId: infoQuestion.vocabulary.topicId,
          userId: infoUser.id,
        },
      });

      if (!infoStudent)
        throw new exceptions.NotFoundError('Not found student', this._logger);

      infoStudent.lastActivityAt = new Date();
      let isCorrect = false;
      if (infoQuestion.type === QuestionType.speak) {
        if ( infoQuestion.correctAnswer.replace(/-/g, ' ') === updateMemoryAnalysisInput.answer)
          isCorrect = true;
      } else 
        isCorrect =
        infoQuestion.correctAnswer === updateMemoryAnalysisInput.answer
          && true;
          
      if (isCorrect) {
        //* calc exp to increase
        const gainedExp =
        infoQuestion.level *
        infoQuestion.vocabulary.level *
        this.EXP_COEFFICIENT;
        await this._userService.updateUserExp(
          infoUser.id,
          gainedExp,
          queryRunner
        );

        const infoMemoryAnalysis = await this._connection
          .getRepository(MemoryAnalysis)
          .findOne({
            where: {
              studentId: infoStudent.id,
              vocabularyId: infoQuestion.vocabularyId,
            },
          });

        //* test new or test learned vocabulary
        if (!infoMemoryAnalysis) {
          await this._testNewVocabulary(
            infoStudent,
            infoQuestion,
            queryRunner
          );
        } else {
          await this._updateActualSkills(
            infoQuestion,
            infoMemoryAnalysis,
            queryRunner
          );

          infoMemoryAnalysis.lastStudiedAt = new Date();
          infoMemoryAnalysis.isFirstTime = false;
          //* if status change, update lastChangedMemoryStatusAt
          if (infoMemoryAnalysis.memoryStatus !== MemoryStatus.memorized)
            infoMemoryAnalysis.lastChangedMemoryStatusAt = new Date();
          infoMemoryAnalysis.memoryStatus = MemoryStatus.memorized;

          await queryRunner.manager.save(infoMemoryAnalysis);
        }
      }
      await queryRunner.manager.save(infoStudent);

      await queryRunner.commitTransaction();
    } catch (error) {
      this._logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //* learn new or learn again
  async learnVocabulary(
    learnVocabularyInput: LearnVocabularyInput,
    identity: Identity
  ): Promise<any> {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let returnedMemoryAnalysis = null;
      const infoUser = await this._connection.getRepository(User).findOne({
        identityId: identity.account?.id,
      });
      if (!infoUser)
        throw new exceptions.NotFoundError('Not found user', this._logger);
        
      const infoVocabulary = await this._connection
        .getRepository(Vocabulary)
        .findOne(learnVocabularyInput.vocabularyId);
      if (!infoVocabulary)
        throw new exceptions.NotFoundError(
          'Not found vocabulary',
          this._logger
        );

      const infoLesson = await this._connection
        .getRepository(Lesson)
        .findOne(learnVocabularyInput.lessonId);
      if (!infoLesson)
        throw new exceptions.NotFoundError('Not found lesson', this._logger);

      const infoStudent = await this._enrollmentRepository.findOne({
        where: {
          userId: infoUser.id,
          topicId: infoVocabulary.topicId,
        },
      });
      if (!infoStudent)
        throw new exceptions.NotFoundError('Not found student', this._logger);

      //* sum skill point
      const totalSkillPoint = learnVocabularyInput.skills.reduce(
        (total: number, skill: string) => {
          return total + this.SKILL_POINT[skill];
        },
        0
      );

      //* update user exp
      const gainedExp =
        totalSkillPoint * infoVocabulary.level * this.EXP_COEFFICIENT;
      this._userService.updateUserExp(
        infoUser.id,
        gainedExp,
        queryRunner
      );

      const infoMemoryAnalysis = await this._connection
        .getRepository(MemoryAnalysis)
        .findOne({
          where: {
            vocabularyId: infoVocabulary.id,
            studentId: infoStudent.id,
            lessonId: infoLesson.id,
          },
        });
      //* learn again
      if (infoMemoryAnalysis) {
        returnedMemoryAnalysis = await this._reviseVocabulary(
          infoMemoryAnalysis,
          learnVocabularyInput.skills,
          queryRunner
        );
      } else {
      //* learn new
        returnedMemoryAnalysis = await this._learnNewVocabulary(
          infoStudent,
          infoVocabulary,
          infoLesson,
          learnVocabularyInput.skills,
          queryRunner
        );      
      }
      infoStudent.lastActivityAt = new Date();
      await queryRunner.manager.save(infoStudent);
      
      await queryRunner.commitTransaction();
      return returnedMemoryAnalysis;
    } catch (error) {
      this._logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findMemoryAnalysisByLessonId(lessonId: string) {
    return this._connection.getRepository(MemoryAnalysis).find({
      where: {
        lessonId,
      },
    });
  }

  //TODO transaction
  async unTrackVocabulary(unTrackVocabularyInput: UnTrackVocabularyInput, identity: Identity) {
    const infoUser = await this._connection.getRepository(User).findOne({
      identityId: identity.account?.id,
    });
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
    const infoVocabulary = await this._connection
      .getRepository(Vocabulary)
      .findOne(unTrackVocabularyInput.vocabularyId);
    if (!infoVocabulary)
      throw new exceptions.NotFoundError('Not found vocabulary', this._logger);

    const infoStudent = await this._enrollmentRepository.findOne({
      where: {
        topicId: unTrackVocabularyInput.topicId,
        userId:infoUser.id
      },
      relations: ['user'],
    });
    if (!infoStudent)
      throw new exceptions.NotFoundError('Not found student', this._logger);

    const infoMemoryAnalysis = await this._connection
      .getRepository(MemoryAnalysis)
      .findOne({
        where: {
          vocabularyId: unTrackVocabularyInput.vocabularyId,
          studentId: infoStudent.id,
        },
        relations: ['actualSkills'],
      });

    //* update last activity
    infoStudent.lastActivityAt = new Date();
    await this._connection.getRepository(Enrollment).save(infoStudent);

    if (infoMemoryAnalysis) {
      //* save the time when the memory analysis was changed
      if (infoMemoryAnalysis.memoryStatus !== MemoryStatus.memorized) {
        infoMemoryAnalysis.lastChangedMemoryStatusAt = new Date();
      }
      infoMemoryAnalysis.unTrackingMode = unTrackVocabularyInput.unTrackingMode;
      infoMemoryAnalysis.memoryStatus = MemoryStatus.memorized;

      await this._connection
        .getRepository(MemoryAnalysis)
        .save(infoMemoryAnalysis);

      if (infoMemoryAnalysis.actualSkills.length > 0) {
        const actualSkillIds = infoMemoryAnalysis.actualSkills.map(
          (actualSkill: ActualSkill) => actualSkill.id
        );
        await this._connection.getRepository(ActualSkill).update(
          {
            id: In(actualSkillIds),
          },
          {
            percent: 1,
          }
        );
      }

      if (unTrackVocabularyInput.unTrackingMode === UnTrackingMode.system) {
        await this._unTrackVocabularySystem(
          infoStudent,
          infoVocabulary,
          unTrackVocabularyInput.unTrackingMode
        );
      }

      return infoMemoryAnalysis;
    }
    //* new vocabulary
    const newMemoryAnalysis = this._connection
      .getRepository(MemoryAnalysis)
      .create();
    newMemoryAnalysis.student = infoStudent;
    newMemoryAnalysis.vocabulary = infoVocabulary;
    newMemoryAnalysis.lessonId = infoVocabulary.lessonId;
    newMemoryAnalysis.memoryStatus = MemoryStatus.memorized;
    newMemoryAnalysis.unTrackingMode = unTrackVocabularyInput.unTrackingMode;
    newMemoryAnalysis.lastStudiedAt = new Date();

    const createdMemoryAnalysis = await this._connection
      .getRepository(MemoryAnalysis)
      .save(newMemoryAnalysis);
    const listSkills = await this._connection.getRepository(Skill).find();

    const createActualSkillPromise = listSkills.map(async (skill: Skill) => {
      const newActualSkill = this._connection
        .getRepository(ActualSkill)
        .create();
      newActualSkill.skill = skill;
      newActualSkill.memoryAnalysis = createdMemoryAnalysis;
      newActualSkill.percent = 1;
      newActualSkill.currentLevel = 1;

      const skillLevel = await this._connection
        .getRepository(SkillLevel)
        .createQueryBuilder('skillLevel')
        .innerJoinAndSelect('skillLevel.level', 'level')
        .andWhere('level.level = :currentLevel', {
          currentLevel: newActualSkill.currentLevel,
        })
        .andWhere('skillLevel.skillId = :skillId', {
          skillId: skill.id,
        })
        .getOne();
      if (skillLevel) newActualSkill.skillLevel = skillLevel;
      return this._connection.getRepository(ActualSkill).save(newActualSkill);
    });
    await Promise.all(createActualSkillPromise);

    //* handle completed topic
    const numberOfLearnedVocabularies = await this._connection
      .getRepository(MemoryAnalysis)
      .count({
        where: {
          studentId: infoStudent.id,
        },
      });
    const numberOfVocabularies = await this._connection
      .getRepository(Vocabulary)
      .count({
        where: {
          topicId: infoStudent.topicId,
        },
      });

    if (numberOfLearnedVocabularies === numberOfVocabularies) {
      infoStudent.isCompleted = true;
      this._notificationService.notify(
        NotificationType.CONGRATULATE_COMPLETED_TOPIC,
        infoStudent.userId,
        infoStudent.topicId
      );
    }
    if (numberOfLearnedVocabularies >= numberOfVocabularies / 3) {
      this._notificationService.notify(
        NotificationType.REVIEW_REQUEST,
        infoStudent.userId,
        infoStudent.topicId
      );
    }

    if (unTrackVocabularyInput.unTrackingMode === UnTrackingMode.system) {
      await this._unTrackVocabularySystem(
        infoStudent,
        infoVocabulary,
        unTrackVocabularyInput.unTrackingMode
      );
    }
    return createdMemoryAnalysis;
  }

  async trackVocabulary(memoryAnalysisId: string) {
    //TODO transaction
    const infoMemoryAnalysis = await this._connection
      .getRepository(MemoryAnalysis)
      .findOne({
        where: {
          id: memoryAnalysisId,
        },
        relations: ['vocabulary'],
      });
    if (!infoMemoryAnalysis)
      throw new exceptions.NotFoundError(
        'Not found memory analysis',
        this._logger
      );
    const infoStudent = await this._enrollmentRepository.findOne({
      where: {
        id: infoMemoryAnalysis.studentId,
      },
      relations: ['user'],
    });
    if (!infoStudent)
      throw new exceptions.NotFoundError('Not found enrollment', this._logger);
    infoStudent.user.ignoredWords?.splice(
      infoStudent.user.ignoredWords.findIndex(
        (word: string) => word === infoMemoryAnalysis.vocabulary.vocabulary
      ),
      1
    );
    await this._connection.getRepository(User).save(infoStudent.user);
    if (infoMemoryAnalysis.unTrackingMode === UnTrackingMode.system) {
      //*  other enrollments
      const enrollments = await this._enrollmentRepository
        .createQueryBuilder('enrollment')
        .innerJoinAndSelect('enrollment.memoryAnalyses', 'memoryAnalyses')
        .innerJoinAndSelect('memoryAnalyses.vocabulary', 'vocabulary')
        .where(
          'enrollment.id != :currentEnrollmentId and enrollment.userId = :userId',
          {
            currentEnrollmentId: infoMemoryAnalysis.studentId,
            userId: infoStudent.userId,
          }
        )
        .getMany();
      enrollments.forEach(async (enrollment: Enrollment) => {
        if (
          !enrollment.memoryAnalyses ||
          enrollment.memoryAnalyses.length === 0
        )
          return;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let index = 0; index < enrollment.memoryAnalyses.length; index++) {
          const memoryAnalysis = enrollment.memoryAnalyses[index];
          if (
            memoryAnalysis.vocabulary.vocabulary ===
            infoMemoryAnalysis.vocabulary.vocabulary
          ) {
            memoryAnalysis.unTrackingMode = null;
            await this._connection
              .getRepository(MemoryAnalysis)
              .save(memoryAnalysis);
            break;
          }
        }
      });
    }
    infoMemoryAnalysis.unTrackingMode = null;
    return this._connection
      .getRepository(MemoryAnalysis)
      .save(infoMemoryAnalysis);
  }

  async getEnrollmentByIds(enrollmentIds: string[]) {
    return this._enrollmentRepository.find({
      where: {
        id: In(enrollmentIds),
      },
    });
  }

}

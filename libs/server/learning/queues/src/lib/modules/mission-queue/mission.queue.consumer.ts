/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  AssignedMissionStatus,
  Enrollment,
  MemoryAnalysis,
  MemoryStatus,
  Question,
  QuestionType,
  Setting,
  User,
  Vocabulary,
} from '@els/server/learning/common';
import { AssignedMission, Repeatable } from '@els/server/learning/mission/data-access/entities';
import { StreakService } from '@els/server/learning/streak/data-access/services';
import { nextLevel } from '@els/server/learning/utils';
import { PUB_SUB } from '@els/server/shared';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as moment from 'moment';
import { Connection } from 'typeorm';
import { MissionQueueProducer } from './mission-queue.producer';

const MISSION_COMPLETED_EVENT = 'missionCompleted';
const EXP_UP_EVENT = 'expUp';
@Processor('mission-queue')
export class MissionQueueConsumer {
  private _logger: Logger = new Logger(MissionQueueConsumer.name);
  constructor(
    private readonly _connection: Connection,
    private readonly _streakService: StreakService,
    private readonly _missionQueueProducer: MissionQueueProducer,
    @Inject(PUB_SUB) private _pubSub: RedisPubSub,
  ) {}
  private async _handleReviewMission(
    infoMemoryAnalysis: MemoryAnalysis,
    infoUser: User
  ) {
    switch (infoMemoryAnalysis.lastMemoryStatus) {
      case MemoryStatus.vague: {
        const relatedMission = await this._connection
          .getRepository(AssignedMission)
          .createQueryBuilder('assignedMission')
          .innerJoinAndSelect('assignedMission.user', 'user')
          .innerJoinAndSelect('assignedMission.mission', 'mission')
          .innerJoinAndSelect('assignedMission.missionTarget', 'missionTarget')
          .innerJoinAndSelect('mission.reward', 'reward')
          .innerJoinAndSelect('reward.rewardUnit', 'rewardUnit')
          .where('assignedMission.userId = :userId', {
            userId: infoUser.id,
          })
          .andWhere('assignedMission.status = :status', {
            status: AssignedMissionStatus.in_progress,
          })
          .andWhere(
            'assignedMission.assignedAt > :startDate and assignedMission.assignedAt < :endDate ',
            {
              startDate: moment().startOf('date'),
              endDate: moment().endOf('date'),
            }
          )
          .andWhere('mission.code IN (:...code)', {
            code: ['review_vague'],
          })
          .getOne();
        if (relatedMission) {
          this._updateProgressMission(relatedMission);
          infoMemoryAnalysis.lastMemoryStatus = MemoryStatus.memorized;
          this._connection
            .getRepository(MemoryAnalysis)
            .save(infoMemoryAnalysis);
        }
        break;
      }
      case MemoryStatus.forgot: {
        const relatedMission = await this._connection
          .getRepository(AssignedMission)
          .createQueryBuilder('assignedMission')
          .innerJoinAndSelect('assignedMission.user', 'user')
          .innerJoinAndSelect('assignedMission.mission', 'mission')
          .innerJoinAndSelect('assignedMission.missionTarget', 'missionTarget')
          .innerJoinAndSelect('mission.reward', 'reward')
          .innerJoinAndSelect('reward.rewardUnit', 'rewardUnit')
          .where('assignedMission.userId = :userId', {
            userId: infoUser.id,
          })
          .andWhere('assignedMission.status = :status', {
            status: AssignedMissionStatus.in_progress,
          })
          .andWhere(
            'assignedMission.assignedAt > :startDate and assignedMission.assignedAt < :endDate ',
            {
              startDate: moment().startOf('date'),
              endDate: moment().endOf('date'),
            }
          )
          .andWhere('mission.code IN (:...code)', {
            code: ['review_forgot'],
          })
          .getOne();
        if (relatedMission) {
          this._updateProgressMission(relatedMission);
          infoMemoryAnalysis.lastMemoryStatus = MemoryStatus.memorized;
          this._connection
            .getRepository(MemoryAnalysis)
            .save(infoMemoryAnalysis);
        }
        break;
      }
      default:
        break;
    }
  }
  private async _handleLearnNewMission(infoUser: User, studentId: string) {
    const relatedOptionalMissions = await this._connection
      .getRepository(AssignedMission)
      .createQueryBuilder('assignedMission')
      .innerJoinAndSelect('assignedMission.user', 'user')
      .innerJoinAndSelect('assignedMission.mission', 'mission')
      .innerJoinAndSelect('assignedMission.missionTarget', 'missionTarget')
      .innerJoinAndSelect('mission.reward', 'reward')
      .innerJoinAndSelect('reward.rewardUnit', 'rewardUnit')
      .where('assignedMission.userId = :userId', { userId: infoUser.id })
      .andWhere('assignedMission.status = :status', {
        status: AssignedMissionStatus.in_progress,
      })
      .andWhere('mission.code IN (:...code)', {
        code: ['learn_new', 'learn_new_in_topic'],
      })
      .getMany();

    const relatedSystemMissions = await this._connection
      .getRepository(AssignedMission)
      .createQueryBuilder('assignedMission')
      .innerJoinAndSelect('assignedMission.user', 'user')
      .innerJoinAndSelect('assignedMission.mission', 'mission')
      .innerJoinAndSelect('mission.reward', 'reward')
      .innerJoinAndSelect('reward.rewardUnit', 'rewardUnit')
      .where('assignedMission.userId = :userId', { userId: infoUser.id })
      .andWhere('assignedMission.status = :status', {
        status: AssignedMissionStatus.in_progress,
      })
      .andWhere('mission.code IN (:...code)', {
        code: ['complete_1_topic', 'complete_2_topics'],
      })
      .getMany();
    const infoStudent = await this._connection
      .getRepository(Enrollment)
      .findOne({
        where: {
          id: studentId,
        },
      });
    const updateProgressMissionPromises = [
      ...relatedSystemMissions,
      ...relatedOptionalMissions,
    ].map(async (assignedMission: AssignedMission) => {
      switch (assignedMission.mission.code) {
        case 'complete_2_topics':
        case 'complete_1_topic': {
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
            return this._updateProgressMission(assignedMission);

          }
          break;
        }
        case 'learn_new': {
          return this._updateProgressMission(assignedMission);
        }
        case 'learn_new_in_topic': {
          if (assignedMission.missionTarget.studentId === studentId) {
            return this._updateProgressMission(assignedMission);
          }
          break;
        }
        default:
          break;
      }
    });
    await Promise.all(updateProgressMissionPromises);
  }
  private async _autoReceiveReward(assignedMission: AssignedMission) {
    assignedMission.status = AssignedMissionStatus.done;
    assignedMission.user.exp += +assignedMission.mission.reward.value;
    assignedMission.user.expDate += +assignedMission.mission.reward.value;

    const settings = await this._connection.getRepository(Setting).findOne({
      where: {
        userId: assignedMission.userId,
      },
    });
    if (settings) {
      if (assignedMission.user.expDate >= settings.exp) {
        //* create streak background
        const activeStreakList = await this._streakService.getStreakList({
          userId: assignedMission.userId || '',
        });
        await this._streakService.backgroundMarkStreak(
          assignedMission.user,
          settings.exp,
          activeStreakList || null
        );
      }
    }
    if (assignedMission.user.exp >= assignedMission.user.nextLevelExp) {
      //* level up
      assignedMission.user.level += 1;
      assignedMission.user.exp =
        assignedMission.user.exp - assignedMission.user.nextLevelExp;
      //* calc exp for next level
      assignedMission.user.nextLevelExp = nextLevel(
        assignedMission.user.level + 1
      );
      this._missionQueueProducer.updateProgressLevelUp(assignedMission.userId);
    }
  
    const user =  await this._connection
      .getRepository(User)
      .save(assignedMission.user);
    const userSubscription = {
      exp: user.exp,
      level: user.level,
      nextLevelExp: user.nextLevelExp,
      expDate: user.expDate,
      identityId: user.identityId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      idSubscription: user.id
    };
    this._pubSub.publish(`${EXP_UP_EVENT}_${user.identityId}`, { expUp: userSubscription });
    return user;
  }
  private async _updateProgressMission(assignedMission: AssignedMission) {
    //* check if mission is expired
    if (assignedMission.mission.repeatable !== Repeatable.NONE && moment().isAfter(moment(assignedMission.expiredAt))) {
      assignedMission.status = AssignedMissionStatus.incomplete;
      return this._connection
        .getRepository(AssignedMission)
        .save(assignedMission);
    };
    assignedMission.currentProgress += 1;
    if (
      assignedMission.currentProgress === assignedMission.maxProgress
    ) {
      assignedMission.completedAt = new Date();
      if (assignedMission.mission.reward.rewardUnit.code === 'exp') {
        this._autoReceiveReward(assignedMission);
      } else {
        assignedMission.status = AssignedMissionStatus.completed;
      }
      //*publish subscription
      const missionSubscription = {
        id: assignedMission.id,
        currentProgress: assignedMission.currentProgress,
        completedAt: assignedMission.completedAt,
        assignedAt: assignedMission.assignedAt,
        maxProgress: assignedMission.maxProgress,
        expiredAt: assignedMission.expiredAt,
        status: assignedMission.status,
        userId: assignedMission.userId,
        missionId: assignedMission.missionId,
        missionTargetId: assignedMission.missionTargetId,
      };
      this._pubSub.publish(`${MISSION_COMPLETED_EVENT}_${assignedMission.user.identityId}`, { missionCompleted: missionSubscription });
    }
    
    return this._connection
      .getRepository(AssignedMission)
      .save(assignedMission);
  }

  @Process({ name: 'check-in', concurrency: 1 })
  async checkIn(job: Job<any>, done: any) {
    try {
      const infoUser = await this._connection.getRepository(User).findOne({
        identityId: job.data.account.id,
      });
      if (!infoUser) throw new Error('Not found user');
      const relatedMissions = await this._connection
        .getRepository(AssignedMission)
        .createQueryBuilder('assignedMission')
        .innerJoinAndSelect('assignedMission.user', 'user')
        .innerJoinAndSelect('assignedMission.mission', 'mission')
        .innerJoinAndSelect('mission.reward', 'reward')
        .innerJoinAndSelect('reward.rewardUnit', 'rewardUnit')
        .where('assignedMission.userId = :userId', { userId: infoUser.id })
        .andWhere('assignedMission.status = :status', {
          status: AssignedMissionStatus.in_progress,
        })
        .andWhere('mission.code IN (:...code)', {
          code: ['check_in'],
        })
        .getMany();
      const updateProgressMissionPromises = relatedMissions.map(
        (assignedMission: AssignedMission) => {
          return this._updateProgressMission(assignedMission);
        }
      );
      await Promise.all(updateProgressMissionPromises);
      done(null, 'success');
    } catch (ex) {
      this._logger.error(ex);
      done(new Error('Insert Document Error'));
    }
  }

  @Process({ name: 'mark-streak', concurrency: 1 })
  async updateProgressStreaks(job: Job<any>, done: any) {
    try {
      const relatedMissions = await this._connection
        .getRepository(AssignedMission)
        .createQueryBuilder('assignedMission')
        .innerJoinAndSelect('assignedMission.user', 'user')
        .innerJoinAndSelect('assignedMission.mission', 'mission')
        .innerJoinAndSelect('mission.reward', 'reward')
        .innerJoinAndSelect('reward.rewardUnit', 'rewardUnit')
        .where('assignedMission.userId = :userId', { userId: job.data.userId })
        .andWhere('assignedMission.status = :status', {
          status: AssignedMissionStatus.in_progress,
        })
        .andWhere('mission.code IN (:...code)', {
          code: ['streaks_3', 'streaks_5'],
        })
        .getMany();
      const updateProgressMissionPromises = relatedMissions.map(
        (assignedMission: AssignedMission) => {
          return this._updateProgressMission(assignedMission);
        }
      );
      await Promise.all(updateProgressMissionPromises);
      done();
    } catch (ex) {
      this._logger.error(ex);
      done(new Error('Insert Document Error'));
    }
  }

  //* all mission which has relation with learning-new-vocabulary
  @Process({ name: 'learning-vocabulary', concurrency: 1 })
  async updateProgressLearningVocabulary(job: Job<any>, done: any) {
    try {
      const infoUser = await this._connection.getRepository(User).findOne({
        identityId: job.data.account.id,
      });
      let infoStudent: Enrollment = null;
      let infoMemoryAnalysis: MemoryAnalysis = null;
      let isCorrect = true;
      //* test
      if (job.data.variableValues.updateMemoryAnalysisInput) {
        const { answer } = job.data.variableValues.updateMemoryAnalysisInput;
        const infoQuestion = await this._connection
          .getRepository(Question)
          .findOne({
            where: {
              id: job.data.variableValues.updateMemoryAnalysisInput.questionId,
            },
            relations: ['vocabulary', 'vocabulary.topic'],
          });
        infoStudent = await this._connection.getRepository(Enrollment).findOne({
          where: {
            userId: infoUser.id,
            topicId: infoQuestion.vocabulary.topicId,
          },
        });
        infoMemoryAnalysis = await this._connection
          .getRepository(MemoryAnalysis)
          .findOne({
            where: {
              vocabularyId: infoQuestion.vocabularyId,
              studentId: infoStudent.id,
            },
          });
        if (infoQuestion.type === QuestionType.speak) {
          if ( infoQuestion.correctAnswer.replace(/-/g, ' ') !== answer)
            isCorrect = false;
        } else 
          isCorrect =
            infoQuestion.correctAnswer !== answer
              && false;
      } else {
        //* learn
        const infoVocabulary = await this._connection
          .getRepository(Vocabulary)
          .findOne({
            where: {
              id: job.data.variableValues.learnVocabularyInput.vocabularyId,
            },
            relations: ['topic'],
          });
        infoStudent = await this._connection.getRepository(Enrollment).findOne({
          where: {
            userId: infoUser.id,
            topicId: infoVocabulary.topicId,
          },
        });
        infoMemoryAnalysis = await this._connection
          .getRepository(MemoryAnalysis)
          .findOne({
            where: {
              vocabularyId:
                job.data.variableValues.learnVocabularyInput.vocabularyId,
              studentId: infoStudent.id,
            },
          });
      }

      //* review
      if (infoMemoryAnalysis && infoMemoryAnalysis.isFirstTime === false) {
        isCorrect && await this._handleReviewMission(infoMemoryAnalysis, infoUser);
        done();
        return;
      }
      //* learn new
      this._handleLearnNewMission(infoUser, infoStudent.id);
      done();
    } catch (ex) {
      this._logger.error(ex);
      done(new Error('Insert Document Error'));
    }
  }

  @Process({ name: 'level-up', concurrency: 1 })
  async updateProgressLevelUp(job: Job<any>, done: any) {
    try {
      const relatedMissions = await this._connection
        .getRepository(AssignedMission)
        .createQueryBuilder('assignedMission')
        .innerJoinAndSelect('assignedMission.user', 'user')
        .innerJoinAndSelect('assignedMission.mission', 'mission')
        .innerJoinAndSelect('mission.reward', 'reward')
        .innerJoinAndSelect('reward.rewardUnit', 'rewardUnit')
        .where('assignedMission.userId = :userId', { userId: job.data.userId })
        .andWhere('assignedMission.status = :status', {
          status: AssignedMissionStatus.in_progress,
        })
        .andWhere('mission.code IN (:...code)', {
          code: ['obtain_level_10'],
        })
        .getMany();
      const updateProgressMissionPromises = relatedMissions.map(
        async (assignedMission: AssignedMission) => {
          return this._updateProgressMission(assignedMission);
        }
      );
      await Promise.all(updateProgressMissionPromises);
      done();
    } catch (ex) {
      this._logger.error(ex);
      done(new Error('Insert Document Error'));
    }
  }

  @Process({ name: 'top-n', concurrency: 1 })
  async updateProgressTopRank(job: Job<any>, done: any) {
    try {
      const relatedMissions = await this._connection
        .getRepository(AssignedMission)
        .createQueryBuilder('assignedMission')
        .innerJoinAndSelect('assignedMission.user', 'user')
        .innerJoinAndSelect('assignedMission.mission', 'mission')
        .innerJoinAndSelect('mission.reward', 'reward')
        .innerJoinAndSelect('reward.rewardUnit', 'rewardUnit')
        .where('assignedMission.userId = :userId', { userId: job.data.userId })
        .andWhere('assignedMission.status = :status', {
          status: AssignedMissionStatus.in_progress,
        })
        .andWhere('mission.code IN (:...code)', {
          code: ['top_1'],
        })
        .getMany();
      const updateProgressMissionPromises = relatedMissions.map(
        async (assignedMission: AssignedMission) => {
          return this._updateProgressMission(assignedMission);
        }
      );
      await Promise.all(updateProgressMissionPromises);
      done();
    } catch (ex) {
      this._logger.error(ex);
      done(new Error('Insert Document Error'));
    }
  }

  @Process({ name: 'invite-n-persons', concurrency: 1 })
  async updateProgressInviteFriends(job: Job<any>, done: any) {
    try {
      const relatedMissions = await this._connection
        .getRepository(AssignedMission)
        .createQueryBuilder('assignedMission')
        .innerJoinAndSelect('assignedMission.user', 'user')
        .innerJoinAndSelect('assignedMission.mission', 'mission')
        .innerJoinAndSelect('mission.reward', 'reward')
        .innerJoinAndSelect('reward.rewardUnit', 'rewardUnit')
        .where('assignedMission.userId = :userId', {
          userId: job.data.inviterId,
        })
        .andWhere('assignedMission.status = :status', {
          status: AssignedMissionStatus.in_progress,
        })
        .andWhere('mission.code IN (:...code)', {
          code: ['invite_5_persons'],
        })
        .getMany();
      const updateProgressMissionPromises = relatedMissions.map(
        async (assignedMission: AssignedMission) => {
          return this._updateProgressMission(assignedMission);
        }
      );
      await Promise.all(updateProgressMissionPromises);
      done();
    } catch (ex) {
      this._logger.error(ex);
      done(new Error('Insert Document Error'));
    }
  }
}

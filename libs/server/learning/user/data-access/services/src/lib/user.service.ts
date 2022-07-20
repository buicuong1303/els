/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  RemoveWordInput,
  CreateUserInput,
} from '@els/server/learning/user/data-access/types';
import {
  User,
  MissionTarget,
} from '@els/server/learning/user/data-access/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Connection, In, LessThan, MoreThan, MoreThanOrEqual, QueryRunner, Repository } from 'typeorm';
import { exceptions, Identity, PUB_SUB } from '@els/server/shared';
import { Inject, Logger } from '@nestjs/common';
import { MissionService } from '@els/server/learning/mission/data-access/services';
import { MemoryAnalysisEnrollment } from '@els/server/learning/memory-analysis/data-access/entities';
import * as moment from 'moment';
import {
  AssignedMission,
  AssignedMissionStatus,
  Enrollment,
  MemoryStatus,
  NotificationType,
  Streak,
  StreakList,
} from '@els/server/learning/common';
import { AssignedMissionMission, Repeatable } from '@els/server/learning/mission/data-access/entities';
import { RankService } from '@els/server/learning/rank/data-access/services';
import { SettingService } from '@els/server/learning/setting/data-access/services';
import { StreakService } from '@els/server/learning/streak/data-access/services';
import { MissionQueueService } from '@els/server/learning/queues';
import { nextLevel } from '@els/server/learning/utils';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AmqpNotificationService } from '@els/server/learning/amqp';

const USER_UPDATED_EVENT = 'userUpdated';
const EXP_UP_EVENT = 'expUp';

export class UserService {
  private readonly _logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly _missionService: MissionService,
    private readonly _rankService: RankService,
    private readonly _settingService: SettingService,
    private readonly _streakService: StreakService,
    private readonly _missionQueueService: MissionQueueService,
    private readonly _notificationService: AmqpNotificationService,
    @Inject(PUB_SUB) private _pubSub: RedisPubSub,
    private readonly _connection: Connection
  ) {}
  private async _calcMemoryFluctuations(memoryAnalyses: MemoryAnalysisEnrollment[], maxLastStudiedAt: Date) {
    const memoryFluctuations = memoryAnalyses.reduce(
      (pre, memoryAnalysis: MemoryAnalysisEnrollment) => {
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

  async updateUserExp (userId: string, incExp: number, queryRunner: QueryRunner ) {
    const user = await this._userRepository.findOne({id: userId}, {relations: ['setting']});
    if (!user) throw new exceptions.NotFoundError('Not found user', this._logger);
    user.exp += incExp;
    user.expDate += incExp;

    if (user.setting) {
      if (user.expDate >= user.setting.exp) {
        const activeStreakList = await this._streakService.getStreakList({
          userId: userId || '',
        });
        await this._streakService.backgroundMarkStreak(
          user,
          user.setting.exp,
          activeStreakList || null,
          queryRunner
        );
      }
    }
    if (user.exp >= user.nextLevelExp) {
      user.level += 1;
      user.exp =
        user.exp - user.nextLevelExp;
      user.nextLevelExp = nextLevel(
        user.level + 1
      );
      this._missionQueueService.updateProgressLevelUpMission(userId);
    }
    const userSubscription = {
      exp: user.exp,
      level: user.level,
      nextLevelExp: user.nextLevelExp,
      expDate: user.expDate,
      identityId: user.identityId,
      idSubscription: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    this._pubSub.publish(`${EXP_UP_EVENT}_${user.identityId}`, { expUp: userSubscription });
    await queryRunner.manager.save(user);
  }

  async getInfoUser(identity: Identity) {
    const infoUser = await this._connection
      .createQueryBuilder(User, 'user')
      .where('user.identityId = :identityId', {
        identityId: identity.account?.id,
      })
      .getOne();
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);

    const memoryAnalysesEnrollment = await this._connection.manager.find(MemoryAnalysisEnrollment, { userId: infoUser.id});
   
    infoUser.memoryFluctuations = {
      memorized: 0,
      vague: 0,
      forgot: 0,
    };
    if (memoryAnalysesEnrollment.length > 0) {
      const maxLastStudiedAt = memoryAnalysesEnrollment
        .filter(
          (item) =>
            moment(item.lastStudiedAt).format('YYYY-MM-DD') !==
          moment().format('YYYY-MM-DD')
        )
        .reduce((pre, current) => {
          if (current.lastStudiedAt.getTime() > pre.getTime())
            pre = current.lastStudiedAt;
          return pre;
        }, memoryAnalysesEnrollment[0].lastStudiedAt);
      infoUser.memoryFluctuations = await this._calcMemoryFluctuations(memoryAnalysesEnrollment, maxLastStudiedAt);
    }

    const numberOfCheckInDays = await this._connection
      .getRepository(AssignedMission)
      .count({
        where: {
          userId: infoUser.id,
          status: In([AssignedMissionStatus.completed, AssignedMissionStatus.done]),
          mission: {
            code: 'check_in',
          },
        },
        relations: ['mission'],
      });

    const numberOfTodoMissions = await this._connection.manager.count(AssignedMissionMission, {
      where: {
        repeatable: Repeatable.DAILY,
        status: AssignedMissionStatus.in_progress,
        userId: infoUser.id, 
        assignedAt: Between(moment().startOf('date'), moment().endOf('date')),
      }
    });

    const numberOfCompletedMissions = await this._connection.manager.count(AssignedMissionMission, {
      where: {
        status: AssignedMissionStatus.completed,
        userId: infoUser.id, 
      }
    });

    const currentStreakList = await this._connection
      .getRepository(StreakList)
      .createQueryBuilder('streakList')
      .leftJoinAndSelect('streakList.streaks', 'streaks')
      .andWhere('streakList.status = :status', { status: 'active' })
      .andWhere('streakList.userId = :userId', { userId: infoUser.id })
      .orderBy({ 'streaks.createdAt': 'ASC' })
      .getOne();

    const numberOfCompletedTopics = await this._connection
      .getRepository(Enrollment)
      .count({
        where: {
          isCompleted: true,
          userId: infoUser.id,
        },
      });
    const maxStreak = await this._connection.getRepository(Streak).query(
      `select streak_list.id, count("streakListId") as num_streaks from streak
      inner join streak_list ON streak_list.id = streak."streakListId"
      group by streak_list.id
      ORDER BY num_streaks desc
      limit 1
      `
    );
    infoUser.extraInfo = {
      numberOfCheckInDays: numberOfCheckInDays,
      currentStreakList: currentStreakList,
      numberOfCompletedTopics: numberOfCompletedTopics,
      maxNumberOfStreaks: maxStreak[0] ? +maxStreak[0]['num_streaks'] : 0,
      numberOfTodoMissions: numberOfTodoMissions,
      numberOfCompletedMissions: numberOfCompletedMissions
    };
    return infoUser;
  }

  async removeWordFromIgnoreList(removeWordInput: RemoveWordInput) {
    const infoUser = await this._userRepository.findOne({
      where: {
        id: removeWordInput.userId,
      },
    });
    if (!infoUser)
      throw new exceptions.NotFoundError('User invalid', this._logger);
    if (!infoUser.ignoredWords)
      throw new exceptions.NotFoundError(
        'Not found word in this ignoredWords',
        this._logger
      );

    const indexWord = infoUser.ignoredWords.findIndex(
      (word: string) => word === removeWordInput.word
    );
    if (indexWord < 0)
      throw new exceptions.NotFoundError(
        'Not found word in this ignoredWords',
        this._logger
      );
    infoUser.ignoredWords.splice(indexWord, 1);
    this._userRepository.save(infoUser);
    return infoUser;
  }

  async createUser(createUserInput: CreateUserInput) {
    const isExistUser = await this._userRepository.findOne({
      where: [{ identityId: createUserInput.identityId }],
    });
    if (isExistUser)
      throw new exceptions.ConflictError(
        'Email or username has been used',
        this._logger
      );
    const newUser = this._userRepository.create(createUserInput);
    const userCreated = await this._userRepository.save(newUser);

    return userCreated;
  }

  async getMissionTargetByIds(missionTargetIds: string[]) {
    return this._connection.getRepository(MissionTarget).find({
      where: {
        id: In(missionTargetIds),
      },
    });
  }

  async findUserById(userId: string) {
    return this._userRepository.findOne(userId);
  }

  async findUserByIdentityId(identityId: string) {
    return this._userRepository.findOne({ identityId });
  }

  async checkIn(identity: Identity) {
    const user = await this._connection
      .createQueryBuilder(User, 'user')
      .where('user.identityId = :identityId', {identityId: identity.account?.id})
      .getOne();
    if(!user) throw new exceptions.NotFoundError('Not found user', this._logger);
    return this._missionQueueService.updateProgressCheckIn(identity.account);
  }

  async createUserWebhook(identityId: string) {
    //* Transaction
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = this._userRepository.create();
      newUser.identityId = identityId;

      const userCreated = await queryRunner.manager.save(newUser);
      //* init rank, mission, setting, mission target for user
      await this._rankService.addUsersToRank(userCreated, queryRunner);

      await this._settingService.createSetting(userCreated, queryRunner);

      await this._missionService.createMissionForUser(userCreated, queryRunner);

      await queryRunner.commitTransaction();
      this._notificationService.notify(NotificationType.WELCOME, userCreated.id, userCreated.id );

      return { userId: userCreated.id };
    } catch (error) {
      this._logger.error(error);
      console.log('loi');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    throw new exceptions.InternalServerError('Cannot create user from Kratos hook!', this._logger, null);
  }

  async getUserByIds(ids: string[]) {
    return this._userRepository.find({
      id: In(ids),
    });
  }

  async resetExpDate() {
    return this._userRepository.update(
      {},
      {
        expDate: 0,
      }
    );
  }

  public async getUserAcceptInvitation(identity: Identity) {
    const user = await this._connection
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.listInvited', 'listInvited')
      .where('user.identityId = :identityId', {identityId: identity.account?.id})
      .getOne();
    if(!user) throw new exceptions.NotFoundError('Not found user', this._logger);

    const listUserAccept = user.listInvited;
    return listUserAccept;
  }

  async updateUser(identity: Identity) {
    const user = await this._connection
      .createQueryBuilder(User, 'user')
      .where('user.identityId = :identityId', {identityId: identity.account?.id})
      .getOne();
    if(!user) throw new exceptions.NotFoundError('Not found user', this._logger);
    user.exp = 6868;
    await this._connection.manager.save(user);
    const userSubscription = {
      exp: user.exp,
      level: user.level,
      nextLevelExp: user.nextLevelExp,
      expDate: user.expDate,
      identityId: user.identityId,
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    this._pubSub.publish(`${USER_UPDATED_EVENT}_${identity.account?.id}`, { userUpdated: userSubscription });
    return user;
  }

  async getUserAttendance(identity: Identity) {
    const assignedMissions = await this._connection
      .createQueryBuilder(AssignedMission, 'assignedMission')
      .leftJoinAndSelect('assignedMission.user', 'user')
      .leftJoinAndSelect('assignedMission.mission', 'mission')
      .where('user.identityId = :identityId', {identityId: identity.account?.id})
      .andWhere('mission.code = :missionCode', {missionCode: 'check_in'})
      .andWhere('assignedMission.completedAt is not null')
      .getMany();
    return assignedMissions;
  }
}

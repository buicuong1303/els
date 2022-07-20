/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  MarkStreakInput,
  GetStreaksArgs,
} from '@els/server/learning/streak/data-access/types';
import { User } from '@els/server/learning/user/data-access/entities';
import { Status } from '@els/server/learning/user/data-access/enums';
import { Connection, QueryRunner } from 'typeorm';
import { exceptions, Identity, PUB_SUB } from '@els/server/shared';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  StreakList,
  Streak,
} from '@els/server/learning/streak/data-access/entities';
import { MissionQueueService } from '@els/server/learning/queues';
import * as moment from 'moment';
import { forwardRef } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
const STREAK_CREATED_EVENT = 'streakCreated';
@Injectable()
export class StreakService {
  private readonly _logger = new Logger(StreakService.name);
  constructor(
    private readonly _connection: Connection,
    @Inject(forwardRef(() => MissionQueueService))
    private readonly _missionQueueService: MissionQueueService,
    @Inject(PUB_SUB) private _pubSub: RedisPubSub,
  ) {}
  async markStreak(
    markStreakInput: MarkStreakInput,
    identity: Identity
  ): Promise<any> {
    const { streakListId } = markStreakInput;
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const infoUser = await this._connection.getRepository(User).findOne({
        identityId: identity.account?.id,
      });
      if (!infoUser)
        throw new exceptions.NotFoundError('Not found user', this._logger);

      if (!streakListId) {
        const newStreakList = this._connection
          .getRepository(StreakList)
          .create();
        newStreakList.user = infoUser;
        newStreakList.userId = infoUser.id;
        const streakListCreated = await queryRunner.manager.save(newStreakList);
        const newStreak = this._connection.getRepository(Streak).create();
        newStreak.streakList = streakListCreated;
        newStreak.streakListId = streakListCreated.id;
        const createdStreak = await queryRunner.manager.save(newStreak);
        await queryRunner.commitTransaction();
        return createdStreak;
      } else {
        const infoStreakList = await this._connection
          .getRepository(StreakList)
          .findOne({
            where: {
              id: streakListId,
              status: Status.ACTIVE,
            },
            relations: ['streaks'],
          });
        if (infoStreakList) {
          const todayStreak = infoStreakList.streaks.find(
            (streak: Streak) =>
              streak.createdAt.getDate() === new Date().getDate()
          );
          if (todayStreak) return;
          //TODO condition to create streak
          const newStreak = this._connection.getRepository(Streak).create();
          newStreak.streakList = infoStreakList;
          newStreak.streakListId = infoStreakList.id;
          const createdStreak = await queryRunner.manager.save(newStreak);
          await queryRunner.commitTransaction();
          return createdStreak;
        }
        throw new exceptions.NotFoundError(
          'Not found streak list',
          this._logger
        );
      }
    } catch (error) {
      this._logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  async getStreakList(getStreaksArgs: GetStreaksArgs) {
    return this._connection.getRepository(StreakList).findOne({
      where: { status: Status.ACTIVE, userId: getStreaksArgs.userId },
      relations: ['streaks'],
    });
  }
  async findByStreakListId(streakListId: string) {
    return this._connection.getRepository(Streak).find({
      where: {
        streakListId,
      },
    });
  }
  async backgroundMarkStreak(
    infoUser: User,
    expTarget: number,
    streakList: StreakList | null = null,
    queryRunner: QueryRunner | null = null
  ): Promise<any> {
    let isHaveOuterTransaction = true;
    if (!queryRunner) {
      isHaveOuterTransaction = false;
      queryRunner = this._connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }
    try {
      if (!streakList) {
        const newStreakList = this._connection
          .getRepository(StreakList)
          .create();
        newStreakList.user = infoUser;
        newStreakList.userId = infoUser.id;
        const streakListCreated = await queryRunner.manager.save(newStreakList);
        const newStreak = this._connection.getRepository(Streak).create();
        newStreak.streakList = streakListCreated;
        newStreak.streakListId = streakListCreated.id;
        newStreak.expDate = infoUser.expDate;
        newStreak.expTarget = expTarget;
        const createdStreak = await queryRunner.manager.save(newStreak);
        !isHaveOuterTransaction && await queryRunner.commitTransaction();
        this._missionQueueService.updateProgressStreaks(infoUser.id);
        const streakSubscription = {
          triggerString: 'Created new streak',
        };
        this._pubSub.publish(`${STREAK_CREATED_EVENT}_${infoUser.identityId}`, { streakCreated: streakSubscription });
        return createdStreak;
      }
      const todayStreak = streakList.streaks.find(
        (streak: Streak) =>
          moment(streak.createdAt).format('MM-DD-YYYY') ===
          moment().format('MM-DD-YYYY')
      );
      if (todayStreak) {
        await queryRunner.manager.update(
          Streak,
          {
            id: todayStreak.id,
          },
          {
            expDate: infoUser.expDate,
          }
        );
      } else {
        const newStreak = this._connection.getRepository(Streak).create();
        newStreak.streakList = streakList;
        newStreak.streakListId = streakList.id;
        newStreak.expDate = infoUser.expDate;
        newStreak.expTarget = expTarget;
        const createdStreak = await queryRunner.manager.save(newStreak);
        if (!isHaveOuterTransaction) {
          await queryRunner.commitTransaction();
        }
        this._missionQueueService.updateProgressStreaks(infoUser.id);
        const streakSubscription = {
          triggerString: 'Created new streak',
        };
        this._pubSub.publish(`${STREAK_CREATED_EVENT}_${infoUser.identityId}`, { streakCreated: streakSubscription });
        return createdStreak;
      }
    } catch (error) {
      this._logger.error(error);
      if (!isHaveOuterTransaction) {
        await queryRunner.rollbackTransaction();
      }
    } finally {
      if (!isHaveOuterTransaction) await queryRunner.release();
    }
  
  }

  async updateStreak(streakId: string, expDate: number) {
    return this._connection.getRepository(Streak).update(
      {
        id: streakId,
      },
      {
        expDate: expDate,
      }
    );
  }
}

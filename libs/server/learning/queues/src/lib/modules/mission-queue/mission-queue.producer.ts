/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GUARDIAN } from '@els/server/shared';

@Injectable()
export class MissionQueueProducer {
  constructor(
    @InjectQueue('mission-queue')
    private readonly _missionQueue: Queue
  ) {}

  async checkIn(account: GUARDIAN.AuthenticateResponse) {
    const jobInsert = await this._missionQueue.add(
      'check-in',
      {
        account,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
      }
    );
    return jobInsert.finished();
  }
  async updateProgressStreaks(userId: string) {
    const jobInsert = await this._missionQueue.add(
      'mark-streak',
      {
        userId,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
      }
    );

    return jobInsert;
  }

  async updateProgressLearningVocabulary(
    variableValues: any,
    account: GUARDIAN.AuthenticateResponse
  ) {
    const jobInsert = await this._missionQueue.add(
      'learning-vocabulary',
      {
        account,
        variableValues,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
      }
    );

    return jobInsert;
  }

  async updateProgressLevelUp(
    userId: string

  ) {
    const jobInsert = await this._missionQueue.add(
      'level-up',
      {
        userId,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
      }
    );
    return jobInsert;
  }

  async updateProgressTopRank(
    userId: string

  ) {
    const jobInsert = await this._missionQueue.add(
      'top-n',
      {
        userId,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
      }
    );
    return jobInsert;
  }

  async updateProgressInvitePersons(
    inviterId: string
  ) {
    const jobInsert = await this._missionQueue.add(
      'invite-n-persons',
      {
        inviterId,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
      }
    );
    return jobInsert;
  }
}

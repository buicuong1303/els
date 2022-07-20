/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { MissionQueueProducer } from './mission-queue.producer';
import { Injectable } from '@nestjs/common';
import { GUARDIAN } from '@els/server/shared';

@Injectable()
export class MissionQueueService {
  constructor(private readonly _missionQueueProducer: MissionQueueProducer) {}

  //* Message but change to any to ignore build failed
  async updateProgressMission(
    parentType: string,
    fieldName: string,
    variableValues: any,
    account: GUARDIAN.AuthenticateResponse
  ) {
    switch (parentType + '_' + fieldName) {
      case 'UserMutations_checkIn':
        this._missionQueueProducer.checkIn(account);
        break;
      case 'EnrollmentMutations_updateMemoryAnalysis':
      case 'EnrollmentMutations_learnVocabulary': {
        this._missionQueueProducer.updateProgressLearningVocabulary(
          variableValues,
          account
        );
        break;
      }
      default:
        break;
    }
  }

  async updateProgressLevelUpMission(userId) {
    this._missionQueueProducer.updateProgressLevelUp(userId);
  }

  async updateProgressTopRank(userId) {
    this._missionQueueProducer.updateProgressTopRank(userId);
  }

  async updateProgressStreaks(userId) {
    this._missionQueueProducer.updateProgressStreaks(userId);
  }

  async updateProgressInvitePersons(inviterId) {
    this._missionQueueProducer.updateProgressInvitePersons(inviterId);
  }

  async updateProgressCheckIn(identity) {
    return this._missionQueueProducer.checkIn(identity);
  }
}

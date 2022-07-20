/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  RewardUnit
} from '@els/server/learning/reward-unit/data-access/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//TODO: need implement paginate function for lazy load
import { In, Repository } from 'typeorm';
@Injectable()
export class RewardUnitService {
  private readonly _logger = new Logger(RewardUnitService.name);
  constructor(
    @InjectRepository(RewardUnit)
    private readonly _rewardUnitRepository: Repository<RewardUnit>,
  ) {}
  async getRewardUnitByIds (ids: string[]) {
    return this._rewardUnitRepository.find({
      id: In(ids)
    });
  }
}

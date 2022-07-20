/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Setting } from '@els/server/learning/setting/data-access/entities';
import { User } from '@els/server/learning/user/data-access/entities';
import { exceptions, Identity } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { UpdateSettingAppInput, UpdateSettingTargetInput } from '@els/server/learning/setting/data-access/types';
import { MissionTarget } from '@els/server/learning/user/data-access/entities';
import * as _ from 'lodash';
import { Mission } from '@els/server/learning/common';

@Injectable()
export class SettingService {
  private readonly _logger = new Logger(SettingService.name);
  constructor(
    private readonly _connection: Connection,
    @InjectRepository(Setting)
    private readonly _settingRepository: Repository<Setting>,
    @InjectRepository(MissionTarget)
    private readonly _missionTargetRepository: Repository<MissionTarget>,
  ) {};

  async createSetting(user: User, queryRunner?: QueryRunner) {
    const setting = this._settingRepository.create();
    setting.userId = user.id;
    const createdSetting = await queryRunner?.manager.save(setting);

    user.setting = createdSetting;
    await queryRunner?.manager.save(user);
    
    const optionalMission = await queryRunner?.manager.getRepository(Mission).find({ type: 'optional' });

    if (!optionalMission) return;
    const createMissionTargetPromises = optionalMission.map((mission: Mission) => {
      const missionTarget = this._connection.getRepository(MissionTarget).create();
      console.log(mission.code);
      if (mission.code === 'learn_new') {
        missionTarget.maxProgress = 5;
        missionTarget.status = 'active';
      } else {
        missionTarget.status = 'inactive';
        missionTarget.maxProgress = 0;
      }
      missionTarget.missionId = mission.id;
      missionTarget.userId = user.id;
      return  queryRunner?.manager.getRepository(MissionTarget).save(missionTarget);
    
    });
    await Promise.all(createMissionTargetPromises);
   
    return setting;
  }

  async getSetting(userId: string) {
    const appSettingRaw = await this._connection
      .createQueryBuilder(Setting, 'setting')
      .leftJoinAndSelect('setting.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    const targetSettingRaw = await this._connection
      .createQueryBuilder(MissionTarget, 'missionTarget')
      .leftJoinAndSelect('missionTarget.user', 'user')
      .leftJoinAndSelect('missionTarget.mission', 'mission')
      .where('user.id = :userId', { userId })
      .andWhere('mission.code IN(:...code)', { code: ['review_forgot', 'learn_new', 'review_vague'] })
      .getMany();

    if(!appSettingRaw || !targetSettingRaw) throw new exceptions.NotFoundError('Not found setting', this._logger);

    const appSetting = _.pick(appSettingRaw, [
      'fromLang', 'learningLang', 'speak', 'listen', 'sound', 'notification', 'exp'
    ]);

    const targetSetting =  targetSettingRaw.reduce((final, targetMission) => {
      return {
        [targetMission.mission.code]: targetMission.maxProgress,
        ...final
      };
    }, {});

    return {
      appSetting,
      targetSetting,
    };
  }

  async updateAppSetting(updateSettingAppInput: UpdateSettingAppInput, identity: Identity) {
    const user = await this._connection
      .createQueryBuilder(User, 'user')
      .where('user.identityId = :identityId', {identityId: identity.account?.id})
      .getOne();

    if(!user) throw new exceptions.NotFoundError('Not found user', this._logger);

    const setting = await this._connection
      .createQueryBuilder(Setting, 'setting')
      .leftJoinAndSelect('setting.user', 'user')
      .where('user.id = :userId', {userId: user.id})
      .getOne();

    if(!setting) throw new exceptions.NotFoundError('Not found setting', this._logger);

    setting.fromLang = updateSettingAppInput.fromLang ??  setting.fromLang;
    setting.learningLang = updateSettingAppInput.learningLang ?? setting.learningLang;
    setting.sound = updateSettingAppInput.sound ?? setting.sound;
    setting.speak = updateSettingAppInput.speak ?? setting.speak;
    setting.listen = updateSettingAppInput.listen ?? setting.listen;
    setting.notification = updateSettingAppInput.notification ?? setting.notification;

    await this._settingRepository.save(setting);

    return setting;
  }

  async updateTargetSetting(updateSettingTargetInput: UpdateSettingTargetInput, identity: Identity) {
    const missionTargets = await this._connection
      .createQueryBuilder(MissionTarget, 'missionTarget')
      .leftJoinAndSelect('missionTarget.user', 'user')
      .leftJoinAndSelect('missionTarget.mission', 'mission')
      .where('user.identityId = :identityId', { identityId: identity.account?.id })
      .andWhere('mission.code IN(:...code)', { code: ['review_forgot', 'learn_new', 'review_vague'] })
      .getMany();

    if(missionTargets.length < 3) throw new exceptions.NotFoundError('Not found mission', this._logger);

    const user = await this._connection
      .createQueryBuilder(User, 'user')
      .where('user.identityId = :identityId', {identityId: identity.account?.id})
      .getOne();

    if(!user) throw new exceptions.NotFoundError('Not found user', this._logger);

    const setting = await this._connection
      .createQueryBuilder(Setting, 'setting')
      .leftJoinAndSelect('setting.user', 'user')
      .where('user.id = :userId', {userId: user.id})
      .getOne();

    if(!setting) throw new exceptions.NotFoundError('Not found setting', this._logger);

    if (updateSettingTargetInput.exp) {
      setting.exp = updateSettingTargetInput.exp;
    }

    await this._settingRepository.save(setting);

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i = 0; i < missionTargets.length; i++) {
      const missionTarget = missionTargets[i];
      if (missionTarget.mission.code === 'review_forgot') {
        missionTarget.maxProgress = updateSettingTargetInput.reviewForgot;

        if (updateSettingTargetInput.reviewForgot === 0) {
          missionTarget.status = 'inactive';
        } else {
          missionTarget.status = 'active';
        }
      }
      
      if (missionTarget.mission.code === 'review_vague') {
        missionTarget.maxProgress = updateSettingTargetInput.reviewVague;

        if (updateSettingTargetInput.reviewVague === 0) {
          missionTarget.status = 'inactive';
        } else {
          missionTarget.status = 'active';
        }
      }

      if (missionTarget.mission.code === 'learn_new') {
        missionTarget.maxProgress = updateSettingTargetInput.learnNew;

        if (updateSettingTargetInput.learnNew === 0) {
          missionTarget.status = 'inactive';
        } else {
          missionTarget.status = 'active';
        }
      }

      await this._missionTargetRepository.save(missionTarget);
    }

    return setting;
  }
}

/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AssignedMissionStatus } from '@els/server/learning/common';
import {
  AssignedMission,
  Mission, Repeatable, Reward
} from '@els/server/learning/mission/data-access/entities';
import {
  DoneAssignedMissionInput
} from '@els/server/learning/mission/data-access/types';
import { MissionQueueService } from '@els/server/learning/queues';
import { StreakService } from '@els/server/learning/streak/data-access/services';
import {
  MissionTarget,
  User
} from '@els/server/learning/user/data-access/entities';
import { exceptions, Identity } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
//TODO: need implement paginate function for lazy load
import { Connection, In, QueryRunner, Repository } from 'typeorm';
@Injectable()
export class MissionService {
  private readonly _logger = new Logger(MissionService.name);
  constructor(
    private readonly _missionQueueService: MissionQueueService,
    @InjectRepository(Mission)
    private readonly _missionRepository: Repository<Mission>,
    private readonly _streakService: StreakService,
    private readonly _connection: Connection
  ) {}


  async getAssignedMissionsOfUser(identity: Identity, category: string) {
    const infoUser = await this._connection.getRepository(User).findOne({
      where: {
        identityId: identity.account?.id,
      },
      relations: ['missionTargets'],
    });
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
  
    const query = this._connection
      .getRepository(AssignedMission)
      .createQueryBuilder('assignedMission')
      .leftJoinAndSelect('assignedMission.missionTarget', 'missionTarget')
      .innerJoinAndSelect('assignedMission.mission', 'mission')
      .andWhere('assignedMission.userId = :userId', {
        userId: infoUser.id,
      });
    switch (category) {
      case 'daily': {
        query.andWhere('mission.repeatable = :repeatable', {
          repeatable: Repeatable.DAILY,
        });
        query
          .andWhere(
            'assignedMission.assignedAt > :startDate and assignedMission.assignedAt < :endDate ',
            {
              //TODO check timezone
              startDate: moment().startOf('date'),
              endDate: moment().endOf('date'),
            }
          )
          .getMany();
        break;
      }
      case 'weekly':
        query.andWhere('mission.repeatable = :repeatable', {
          repeatable: Repeatable.WEEKLY,
        });
        query.andWhere(
          'assignedMission.assignedAt > :startDate and assignedMission.assignedAt < :endDate ',
          {
            startDate: moment().startOf('isoWeek'),
            endDate: moment().endOf('isoWeek'),
          }
        );
        break;
      case 'completed': {
        const completedMissionQuery = query.clone();
        const doneMissionQuery = query.clone();
          
        const completedMissions = await completedMissionQuery
          .andWhere('mission.repeatable != :repeatable', {
            repeatable: Repeatable.NONE,
          })
          .andWhere('assignedMission.status = :status', {
            status: AssignedMissionStatus.completed,
          })
          .getMany();
        const doneMissions = await doneMissionQuery
          .andWhere('mission.repeatable != :repeatable', {
            repeatable: Repeatable.NONE,
          })
          .andWhere('assignedMission.status = :status', {
            status: AssignedMissionStatus.done,
          })
          .andWhere(
            'assignedMission.assignedAt > :startDate and assignedMission.assignedAt < :endDate ',
            { startDate: moment().startOf('date'), endDate: moment().endOf('date') }
          )
          .getMany();
        return [...completedMissions, ...doneMissions];
      }
  
      case 'none-repeatable':
        //TODO check available mission
        query.andWhere('mission.repeatable = :repeatable', {
          repeatable: Repeatable.NONE,
        });
        break;
      default:
        break;
    }
    const assignedMissions = await query.getMany();
    return assignedMissions;
  }

  async getMissionByIds(ids: string[]) {
    return this._missionRepository.find({
      id: In(ids),
    });
  }

  async getRewardByIds(ids: string[]) {
    return this._connection.getRepository(Reward).find({
      id: In(ids),
    });
  }

  async getAllMissions() {
    return this._missionRepository.find({});
  }

  async doneAssignedMission(
    doneAssignedMissionInput: DoneAssignedMissionInput
  ) {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const infoAssignedMission = await this._connection
        .getRepository(AssignedMission)
        .findOne({
          where: {
            id: doneAssignedMissionInput.assignedMissionId,
            status: AssignedMissionStatus.completed,
            //TODO check if mission is completed
          },
          relations: [
            'user',
            'mission',
            'mission.reward',
            'mission.reward.rewardUnit',
          ],
        });
      if (!infoAssignedMission)
        throw new exceptions.NotFoundError(
          'Not found assigned mission',
          this._logger
        );
      //TODO convert to enum
      infoAssignedMission.status = AssignedMissionStatus.done;
      await queryRunner.manager.save(infoAssignedMission);
      if (infoAssignedMission.mission.reward) {
        switch (infoAssignedMission.mission.reward.rewardUnit.code) {
          //TODO convert to enum
          case 'coin': {
            break;
          }

          default:
            break;
        }
      }
      await queryRunner.commitTransaction();

      return infoAssignedMission;
    } catch (error) {
      this._logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //* for web hook
  async createMissionForUser(user: User, queryRunner: QueryRunner) {
    //* assign system mission and daily mission
    const missions = await queryRunner.manager.getRepository(Mission).find({
      where: [ {
        repeatable: Repeatable.NONE,
      }, { 
        code: In(['learn_new', 'check_in'])
      }],
    });

    if (missions && missions.length > 0) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < missions.length; i++) {
        const mission = missions[i];
        const newAssignedMission = queryRunner.manager
          .getRepository(AssignedMission)
          .create();

        newAssignedMission.assignedAt = new Date();
        newAssignedMission.mission = mission;
        newAssignedMission.missionId = mission.id;
        newAssignedMission.status = AssignedMissionStatus.in_progress;
        newAssignedMission.user = user;
        newAssignedMission.userId = user.id;
        newAssignedMission.maxProgress = mission.maxProgress;
        newAssignedMission.expiredAt =  mission.durationHours !== -1 ? moment().endOf('date').toDate() : null;

        if (mission.code === 'obtain_level_10' ) newAssignedMission.currentProgress = 1;
        if (mission.code === 'learn_new' ) {
          const infoMissionTarget = await queryRunner.manager.getRepository(MissionTarget).findOne({
            where: {
              userId: user.id,
              missionId: mission.id
            }
          });
          if (infoMissionTarget) {
            newAssignedMission.missionTarget = infoMissionTarget;
          }
        }
        await queryRunner.manager
          .getRepository(AssignedMission)
          .save(newAssignedMission);
      }
    }
  }

  //* for test
  async assignNoneRepeatableMission(userId: string) {
    const infoUser = await this._connection.getRepository(User).findOne({
      where: {
        id: userId,
      },
    });
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
    const nonRepeatableAssignedMission = await this._connection
      .getRepository(AssignedMission)
      .find({
        where: {
          userId,
          mission: {
            repeatable: Repeatable.NONE,
          },
        },
        relations: ['mission'],
      });
    const noneRepeatableMissions = await this._missionRepository.find({
      where: {
        repeatable: Repeatable.NONE,
      },
    });
    //TODO check mission related with level
    noneRepeatableMissions.forEach((mission: Mission) => {
      let isAssigned = false;
      isAssigned = nonRepeatableAssignedMission.some(
        (assignedMission: AssignedMission) =>
          assignedMission.missionId === mission.id
      );
      if (!isAssigned) {
        const newAssignedMission = this._connection
          .getRepository(AssignedMission)
          .create();
        newAssignedMission.assignedAt = new Date();
        newAssignedMission.mission = mission;
        newAssignedMission.missionId = mission.id;
        newAssignedMission.missionTarget = null;
        newAssignedMission.status = AssignedMissionStatus.in_progress;
        newAssignedMission.user = infoUser;
        newAssignedMission.userId = infoUser.id;
        newAssignedMission.maxProgress = mission.maxProgress;
        this._connection.getRepository(AssignedMission).save(newAssignedMission);
      }
    });
    return 'success';
  }
}

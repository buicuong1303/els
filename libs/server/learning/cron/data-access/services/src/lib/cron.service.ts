/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AmqpNotificationService } from '@els/server/learning/amqp';
import {
  AssignedMission,
  AssignedMissionStatus,
  MemoryStatus,
  Mission,
  MissionTarget,
  NotificationType,
  redisOptions,
  Repeatable,
  SkillLevel,
  Status,
  Streak,
  StreakList,
  Type,
  User,
} from '@els/server/learning/common';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import {
  ActualSkill,
  ActualSkillHistory,
  MemoryAnalysis,
} from '@els/server/learning/memory-analysis/data-access/entities';
import { RankService } from '@els/server/learning/rank/data-access/services';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import * as moment from 'moment';
import * as Redis from 'ioredis';
import { Connection, MoreThan, Not } from 'typeorm';
@Injectable()
export class CronService {
  private readonly _logger = new Logger(CronService.name);
  constructor(
    private readonly _connection: Connection,
    //* avoid circular dependency service
    @Inject(forwardRef(() => AmqpNotificationService))
    private readonly _amqpNotificationService: AmqpNotificationService,
    private readonly _rankService: RankService
  ) {}

  //*----ACTUAL-SKILL----
  async handleCreateActualSkillHistory() {
    const actualSkills = await this._connection
      .getRepository(ActualSkill)
      .createQueryBuilder('actualSkill')
      .andWhere('actualSkill.updatedAt BETWEEN :startTime AND :endTime', {
        startTime: moment().startOf('date'),
        endTime: moment().endOf('date'),
      })
      .getMany();
    const createActualSkillHistoryPromise = actualSkills.map(
      (actualSkill: ActualSkill) => {
        const newActualSkillHistory = this._connection
          .getRepository(ActualSkillHistory)
          .create();
        newActualSkillHistory.actualSkillId = actualSkill.id;
        newActualSkillHistory.percent = actualSkill.percent;
        newActualSkillHistory.memoryAnalysisId = actualSkill.memoryAnalysisId;
        newActualSkillHistory.levelUpAt = actualSkill.levelUpAt;
        newActualSkillHistory.currentLevel = actualSkill.currentLevel;
        newActualSkillHistory.skillId = actualSkill.skillId;
        newActualSkillHistory.skillLevelId = actualSkill.skillLevelId;
        return this._connection
          .getRepository(ActualSkillHistory)
          .save(newActualSkillHistory);
      }
    );
    await Promise.all(createActualSkillHistoryPromise);
  }

  //*----ENROLLMENT----
  private async _calcMemoryAnalysis(memoryAnalysis: MemoryAnalysis) {
    //* handle reading
    //? adjust percentage reduction speed
    let K = 0;
    if (
      memoryAnalysis.vocabulary.level === 3 ||
      memoryAnalysis.vocabulary.level === 4
    ) {
      K = 0.05;
    }

    const actualSkills = await this._connection
      .getRepository(ActualSkill)
      .find({
        where: {
          memoryAnalysisId: memoryAnalysis.id,
        },
        relations: ['skill', 'skillLevel'],
      });
    if (actualSkills.length !== 4) {
      console.log('Not found any actual skikk');
      return;
    };

    //* loop actual skill to re-calc percent 
    const updateActualSkill = actualSkills.map((actualSkill: ActualSkill) => {
      let Tskill = 0;
      //* calc distance between now and the last learning
      const totalHours = moment().diff(actualSkill.updatedAt, 'hours');
      let days = totalHours / 24;
      if (totalHours % 24 > 18) days++;
      Tskill = days;

      if (Tskill >= 1) {
        const alpha = actualSkill.skillLevel.alpha || 0;
        const remainPercent = actualSkill.percent * Math.pow(alpha - K, Tskill);
        actualSkill.percent = remainPercent;
        return this._connection.getRepository(ActualSkill).save(actualSkill);
      }
      return actualSkill;
    });
    const updatedActualSkill = await Promise.all(updateActualSkill);
    //* find max percent to update memory status
    if (updatedActualSkill) {
      const maxSkill = Math.max(
        ...[
          +updatedActualSkill[0].percent,
          +updatedActualSkill[1].percent,
          +updatedActualSkill[2].percent,
          +updatedActualSkill[3].percent,
        ]
      );
      //TODO parameterization magic number
      const beforeUpdateMemoryStatus = memoryAnalysis.memoryStatus;
      if (maxSkill >= 0.5) {
        memoryAnalysis.memoryStatus = MemoryStatus.memorized;
      }
      if (maxSkill < 0.5 && maxSkill > 0.19) {
        memoryAnalysis.memoryStatus = MemoryStatus.vague;
      }
      if (maxSkill <= 0.19) {
        memoryAnalysis.memoryStatus = MemoryStatus.forgot;
      }
      const afterUpdateMemoryStatus = memoryAnalysis.memoryStatus;
      if (beforeUpdateMemoryStatus !== afterUpdateMemoryStatus) {
        memoryAnalysis.lastChangedMemoryStatusAt = moment().toDate();
      }
      memoryAnalysis.lastMemoryStatus = memoryAnalysis.memoryStatus;
      await this._connection.getRepository(MemoryAnalysis).save(memoryAnalysis);
    }
  }

  private async _calcMemoryAnalyses(
    memoryAnalyses: MemoryAnalysis[],
    cbCalcMemoryAnalyses: any
  ) {
    const FIRST_ITEM_FOR_LOOP = 0;
    const length = memoryAnalyses.length;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    function helpSplit(i: number, cbHelpSplit: any) {
      if (!memoryAnalyses[i]) console.log('Undefine');
      self._calcMemoryAnalysis(memoryAnalyses[i]);
      if (i === length - 1) return cbHelpSplit();
      setImmediate(helpSplit.bind(null, i + 1, cbHelpSplit));
    }
    helpSplit(FIRST_ITEM_FOR_LOOP, () => cbCalcMemoryAnalyses());
  }
  private async _reduceLevelActualSkill(actualSkill: ActualSkill) {
    try {
      const days = moment().diff(
        moment(actualSkill?.levelDownAt ?? actualSkill.levelUpAt),
        'days'
      );
      let needLevelDown = 0;
      //* chu ky
      let T = 30;
      //* calc level needs to be reduced
      if (actualSkill.currentLevel >= 1 && actualSkill.currentLevel <= 3) {
        needLevelDown = Math.floor(days / T);
      } else if (
        actualSkill.currentLevel >= 4 &&
        actualSkill.currentLevel <= 6
      ) {
        T = 60;
        needLevelDown = Math.floor(days / T);
      } else {
        T = 90;
        needLevelDown = Math.floor(days / T);
      }
      if (needLevelDown > 0) {
        actualSkill.currentLevel = actualSkill.currentLevel - needLevelDown;
        actualSkill.levelDownAt = moment().toDate();
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
        await this._connection.getRepository(ActualSkill).save(actualSkill);
      }
    } catch (error) {
      this._logger.error(error);
    }
  }

  private async _reduceLevelActualSkills(
    actualSkills: ActualSkill[],
    cbReduceActualSkills: any
  ) {
    const FIRST_ITEM_FOR_LOOP = 0;
    const length = actualSkills.length;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    function helpSplit(i: number, cbHelpSplit: any) {
      self._reduceLevelActualSkill(actualSkills[i]);
      if (i === length - 1) return cbHelpSplit();
      setImmediate(helpSplit.bind(null, i + 1, cbHelpSplit));
    }
    helpSplit(FIRST_ITEM_FOR_LOOP, () => cbReduceActualSkills());
  }

  private async _checkAvailableMissionTarget(
    mission: Mission,
    user: User,
    matchMissionTarget: MissionTarget
  ) {
    let isAvailable = true;
    switch (mission.code) {
      case 'review_forgot': {
        const count = await this._connection
          .getRepository(MemoryAnalysis)
          .createQueryBuilder('memoryAnalysis')
          .innerJoin('memoryAnalysis.student', 'student')
          .innerJoin('student.user', 'user')
          .where('user.id = :userId', { userId: user.id })
          .andWhere('memoryAnalysis.memoryStatus = :memoryStatus', {
            memoryStatus: MemoryStatus.forgot,
          })
          .getCount();

        if (count < matchMissionTarget.maxProgress) isAvailable = false;
        break;
      }
      case 'review_vague': {
        const count = await this._connection
          .getRepository(MemoryAnalysis)
          .createQueryBuilder('memoryAnalysis')
          .innerJoin('memoryAnalysis.student', 'student')
          .innerJoin('student.user', 'user')
          .where('user.id = :userId', { userId: user.id })
          .andWhere('memoryAnalysis.memoryStatus = :memoryStatus', {
            memoryStatus: MemoryStatus.vague,
          })
          .getCount();

        if (count < matchMissionTarget.maxProgress) isAvailable = false;
        break;
      }
      default:
        break;
    }
    return isAvailable;
  }

  async handleCalcMemoryAnalysis() {
    const enrollments = await this._connection.getRepository(Enrollment).find({
      relations: ['memoryAnalyses', 'memoryAnalyses.vocabulary'],
    });

    enrollments.forEach((enrollment: Enrollment) => {
      if (enrollment.memoryAnalyses && enrollment.memoryAnalyses.length > 0)
        this._calcMemoryAnalyses(enrollment.memoryAnalyses, () =>
          this._logger.debug('calc memory analysis done')
        );
    });
  }

  async handleReduceLevelActualSkill() {
    const actualSkills = await this._connection
      .getRepository(ActualSkill)
      .find({
        where: {
          currentLevel: MoreThan(1),
        },
        relations: ['skill', 'skillLevel'],
      });
    if (actualSkills.length > 0)
      this._reduceLevelActualSkills(actualSkills, () =>
        this._logger.debug('reduce level memory actual skill done')
      );
  }

  //*----MISSION----

  private async _assignDailyMission(
    assignedDailyMissions: AssignedMission[],
    mission: Mission,
    user: User
  ) {
    //* DAILY
    if (mission.type === Type.SYSTEM) {
      let isAssigned = false;
      isAssigned = assignedDailyMissions.some(
        (assignedMission: AssignedMission) =>
          assignedMission.missionId === mission.id
      );
      //* check if mission is assigned or not
      if (!isAssigned) {
        //* assign new
        const newAssignedMission = this._connection
          .getRepository(AssignedMission)
          .create();
        newAssignedMission.assignedAt = moment().toDate();
        newAssignedMission.mission = mission;
        newAssignedMission.missionId = mission.id;
        newAssignedMission.missionTarget = null;
        newAssignedMission.status = AssignedMissionStatus.in_progress;
        newAssignedMission.user = user;
        newAssignedMission.userId = user.id;
        newAssignedMission.maxProgress = mission.maxProgress;
        newAssignedMission.expiredAt = mission.durationHours
          ? moment().endOf('date').toDate()
          : null;
        this._connection
          .getRepository(AssignedMission)
          .save(newAssignedMission)
          .catch(() => console.log(' not assign system mission error'));
      } else {
        //* check expire
        const expiredAssignedMission = assignedDailyMissions.find(
          (assignedMission: AssignedMission) =>
            assignedMission.missionId === mission.id &&
            moment().isAfter(moment(assignedMission.expiredAt))
        );
        //* if expire, change status
        if (expiredAssignedMission) {
          expiredAssignedMission.status = AssignedMissionStatus.incomplete;
          await this._connection
            .getRepository(AssignedMission)
            .save(expiredAssignedMission);

          const newAssignedMission = this._connection
            .getRepository(AssignedMission)
            .create();
          newAssignedMission.assignedAt = moment().toDate();
          newAssignedMission.mission = mission;
          newAssignedMission.missionId = mission.id;
          newAssignedMission.missionTarget = null;
          newAssignedMission.status = AssignedMissionStatus.in_progress;
          newAssignedMission.user = user;
          newAssignedMission.userId = user.id;
          newAssignedMission.expiredAt = mission.durationHours
            ? moment().endOf('date').toDate()
            : null;
          newAssignedMission.maxProgress = mission.maxProgress;
          return this._connection
            .getRepository(AssignedMission)
            .save(newAssignedMission)
            .catch(() => console.log(' expired system mission error'));
        }
      }
    } else {
      const activeMissionTargets = user.missionTargets?.filter(
        (missionTarget: MissionTarget) => missionTarget.status === Status.ACTIVE
      );
      //* check if the user has set a targe for this mission
      if (!activeMissionTargets || activeMissionTargets.length === 0) return;

      //* find targets which match the mission
      const matchMissionTargets = activeMissionTargets.filter(
        (missionTarget: MissionTarget) => missionTarget.missionId === mission.id
      );
      if (matchMissionTargets.length === 0) return;

      matchMissionTargets.forEach(async (matchMissionTarget) => {
        let isAssigned = false;
        isAssigned = assignedDailyMissions.some(
          (assignedMission: AssignedMission) =>
            assignedMission.missionTargetId === matchMissionTarget.id
        );
        if (!isAssigned) {
          //* check if the remaining vocabulary is ready to be assigned
          const isAvailable = await this._checkAvailableMissionTarget(
            mission,
            user,
            matchMissionTarget
          );
          if (isAvailable) {
            const newAssignedMission = this._connection
              .getRepository(AssignedMission)
              .create();
            newAssignedMission.assignedAt = moment().toDate();
            newAssignedMission.status = AssignedMissionStatus.in_progress;
            newAssignedMission.missionTarget = matchMissionTarget;
            newAssignedMission.mission = mission;
            newAssignedMission.user = user;
            newAssignedMission.expiredAt = mission.durationHours
              ? moment().endOf('date').toDate()
              : null;
            newAssignedMission.maxProgress = matchMissionTarget.maxProgress;
            this._connection
              .getRepository(AssignedMission)
              .save(newAssignedMission)
              .catch(() => console.log(' not assign optional mission error'));
            return;
          }
        } else {
          const expiredAssignedMission = assignedDailyMissions.find(
            (assignedMission: AssignedMission) =>
              assignedMission.missionId === mission.id &&
              moment().isAfter(moment(assignedMission.expiredAt))
          );
          if (expiredAssignedMission) {
            expiredAssignedMission.status = AssignedMissionStatus.incomplete;
            await this._connection
              .getRepository(AssignedMission)
              .save(expiredAssignedMission)
              .catch(() => 'error update incomplete mission');

            const isAvailable = await this._checkAvailableMissionTarget(
              mission,
              user,
              matchMissionTarget
            );

            if (isAvailable) {
              const newAssignedMission = this._connection
                .getRepository(AssignedMission)
                .create();
              newAssignedMission.assignedAt = moment().toDate();
              newAssignedMission.status = AssignedMissionStatus.in_progress;
              newAssignedMission.missionTarget = matchMissionTarget;
              newAssignedMission.mission = mission;
              newAssignedMission.user = user;
              newAssignedMission.expiredAt = mission.durationHours
                ? moment().endOf('date').toDate()
                : null;
              newAssignedMission.maxProgress = matchMissionTarget.maxProgress;
              this._connection
                .getRepository(AssignedMission)
                .save(newAssignedMission)
                .catch(() => console.log('expired optional mission error'));
              return;
            }
          }
        }
      });
    }
  }

  private _assignWeeklyMission(
    assignedWeeklyMissions: AssignedMission[],
    mission: Mission,
    user: User
  ) {
    //* WEEKLY
    const isAssigned = assignedWeeklyMissions.some(
      (assignedMission: AssignedMission) =>
        assignedMission.missionId === mission.id
    );
    if (!isAssigned) {
      const newAssignedMission = this._connection
        .getRepository(AssignedMission)
        .create();
      newAssignedMission.assignedAt = moment().toDate();
      newAssignedMission.mission = mission;
      newAssignedMission.missionId = mission.id;
      newAssignedMission.status = AssignedMissionStatus.in_progress;
      newAssignedMission.user = user;
      newAssignedMission.userId = user.id;
      newAssignedMission.maxProgress = mission.maxProgress;
      this._connection.getRepository(AssignedMission).save(newAssignedMission);
    }
  }

  private _assignTimesMission(
    assignedTimesMissions: AssignedMission[],
    mission: Mission,
    user: User
  ) {
    //* WEEKLY
    //* count number of time a mission is assigned
    const numOfTimesAssigned = assignedTimesMissions.filter(
      (assignedMission: AssignedMission) =>
        assignedMission.missionId === mission.id
    ).length;
    const isReachLimit =
      numOfTimesAssigned === mission.cooldownTime ? true : false;
    if (!isReachLimit) {
      const newAssignedMission = this._connection
        .getRepository(AssignedMission)
        .create();
      newAssignedMission.assignedAt = moment().toDate();
      newAssignedMission.mission = mission;
      newAssignedMission.missionId = mission.id;
      newAssignedMission.status = AssignedMissionStatus.in_progress;
      newAssignedMission.user = user;
      newAssignedMission.userId = user.id;
      newAssignedMission.maxProgress = mission.maxProgress;
      this._connection.getRepository(AssignedMission).save(newAssignedMission);
    }
  }

  private async _assignMissionToUser(user: User) {
    const missions = await this._connection.getRepository(Mission).find({
      where: {
        repeatable: Not('none'),
      },
      relations: ['availableMissions'],
    });

    const assignedDailyMissions = await this._connection
      .getRepository(AssignedMission)
      .createQueryBuilder('assignedMission')
      .innerJoinAndSelect('assignedMission.mission', 'mission')
      .andWhere('mission.repeatable = :repeatable', {
        repeatable: Repeatable.DAILY,
      })
      .andWhere('assignedMission.status = :status', {
        status: 'in_progress',
      })
      .andWhere('assignedMission.userId = :userId', {
        userId: user.id,
      })
      .getMany();

    const assignedWeeklyMissions = await this._connection
      .getRepository(AssignedMission)
      .createQueryBuilder('assignedMission')
      .innerJoinAndSelect('assignedMission.mission', 'mission')
      .andWhere('mission.repeatable = :repeatable', {
        repeatable: Repeatable.WEEKLY,
      })
      .andWhere('assignedMission.userId = :userId', {
        userId: user.id,
      })
      .getMany();

    const assignedTimeMissions = await this._connection
      .getRepository(AssignedMission)
      .createQueryBuilder('assignedMission')
      .innerJoinAndSelect('assignedMission.mission', 'mission')
      .andWhere('mission.repeatable = :repeatable', {
        repeatable: Repeatable.TIMES,
      })
      .andWhere('assignedMission.userId = :userId', {
        userId: user.id,
      })
      .getMany();

    missions.forEach(async (mission) => {
      switch (mission.repeatable) {
        case Repeatable.DAILY:
          this._assignDailyMission(assignedDailyMissions, mission, user);
          break;
        case Repeatable.WEEKLY:
          this._assignWeeklyMission(assignedWeeklyMissions, mission, user);
          break;
        case Repeatable.TIMES:
          this._assignTimesMission(assignedTimeMissions, mission, user);
          break;
        default:
          break;
      }
    });
  }

  private async _assignMission(users: User[], assignMissionCb: any) {
    const FIRST_ITEM_FOR_LOOP = 0;
    const length = users.length;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    function helpSplit(i: number, cbHelpSplit: any) {
      self._assignMissionToUser(users[i]);
      if (i === length - 1) return cbHelpSplit();
      setImmediate(helpSplit.bind(null, i + 1, cbHelpSplit));
    }
    helpSplit(FIRST_ITEM_FOR_LOOP, () => {
      return assignMissionCb();
    });
  }

  async handleAssignMission() {
    const users = await this._connection.getRepository(User).find({
      relations: ['missionTargets'],
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this._assignMission(users, () => {});
  }

  //*----STREAK----
  async handleInactivateStreakList() {
    const users = await this._connection.getRepository(User).find();
    const currentDate = moment().toDate().getDate();
    users.forEach(async (user: User) => {
      const streakList = await this._connection
        .getRepository(StreakList)
        .findOne({
          where: {
            userId: user.id,
            status: Status.ACTIVE,
          },
          relations: ['streaks'],
        });
      if (streakList) {
        //* check if today does not have any streak
        const todayStreak = streakList.streaks.find(
          (streak: Streak) => streak.createdAt.getDate() === currentDate
        );
        if (!todayStreak) {
          streakList.status = Status.INACTIVE;
        }
        this._connection.getRepository(StreakList).save(streakList);
      }
    });
  }

  //*----NOTIFICATION----
  async handleRemindPracticeMorning() {
    return this._amqpNotificationService.notify(
      NotificationType.REMIND_PRACTICE_MORNING
    );
  }

  async handleRemindPracticeAfternoon() {
    return this._amqpNotificationService.notify(
      NotificationType.REMIND_PRACTICE_AFTERNOON
    );
  }

  async handleRemindPracticeEvening() {
    return this._amqpNotificationService.notify(
      NotificationType.REMIND_PRACTICE_EVENING
    );
  }

  async handleRemindPracticeMidnight() {
    return this._amqpNotificationService.notify(
      NotificationType.REMIND_PRACTICE_MIDNIGHT
    );
  }

  async handleRemindComeBack() {
    return this._amqpNotificationService.notify(
      NotificationType.REMIND_COMEBACK
    );
  }

  async handleComplain1() {
    return this._amqpNotificationService.notify(NotificationType.COMPLAIN_1);
  }

  //*------RANK----
  async handleUpdateRank() {
    const cache = new BaseRedisCache({
      client: new Redis(redisOptions)
    });
    return this._rankService.updateRank(cache);
  }

  //*---RESET---EXP_DATE----
  async handleResetExpDate() {
    await this._connection.getRepository(User).update({}, { expDate: 0 });
    return 'success';
  }
}

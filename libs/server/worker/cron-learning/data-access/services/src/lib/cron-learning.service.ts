/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AmqpLearningService } from '@els/server/worker/amqp';
import { NotificationType } from '@els/server/learning/common';

@Injectable()
export class CronLearningService {
  private readonly logger = new Logger(CronLearningService.name);
  constructor(private readonly _amqpLearningService: AmqpLearningService) {}

  @Cron(process.env.CRON_CREATE_ACTUAL_SKILL_HISTORY || '')
  public handleCreateActualSkillHistory() {
    return this._amqpLearningService.handleCreateActualSkillHistory();
  }

  @Cron(process.env.CRON_CALC_MEMORY_ANALYSIS || '')
  public handleCalcMemoryAnalysis() {
    return this._amqpLearningService.handleCalcMemoryAnalysis();
  }

  @Cron(process.env.CRON_REDUCE_LEVEL_ACTUAL_SKILL || '')
  public handleReduceLevelActualSkill() {
    return this._amqpLearningService.handleReduceLevelMemoryAnalysis();
  }

  @Cron(process.env.CRON_ASSIGN_MISSION || '')
  public handleAssignMission() {
    return this._amqpLearningService.handleAssignMission();
  }

  @Cron(process.env.CRON_INACTIVE_STREAK_LIST || '')
  public handleInactiveStreakList() {
    return this._amqpLearningService.handleInactiveStreakList();
  }

  @Cron(process.env.CRON_REMIND_PRACTICE_MORNING || '')
  public handleRemindPracticeMorning() {
    return this._amqpLearningService.handleNotify(NotificationType.REMIND_PRACTICE_MORNING);
  }

  @Cron(process.env.CRON_REMIND_PRACTICE_AFTERNOON || '')
  public handleRemindPracticeAfternoon() {
    return this._amqpLearningService.handleNotify(NotificationType.REMIND_PRACTICE_AFTERNOON);
  }

  @Cron(process.env.CRON_REMIND_PRACTICE_EVENING || '')
  public handleRemindPracticeEvening() {
    return this._amqpLearningService.handleNotify(NotificationType.REMIND_PRACTICE_EVENING);
  }

  @Cron(process.env.CRON_REMIND_PRACTICE_MIDNIGHT || '')
  public handleRemindPracticeMidnight() {
    return this._amqpLearningService.handleNotify(NotificationType.REMIND_PRACTICE_MIDNIGHT);
  }

  @Cron(process.env.CRON_REMIND_COMEBACK || '')
  public handleRemindComeback() {
    return this._amqpLearningService.handleNotify(NotificationType.REMIND_COMEBACK);
  }

  @Cron(process.env.CRON_COMPLAIN_1 || '')
  public handleComplain1() {
    return this._amqpLearningService.handleNotify(NotificationType.COMPLAIN_1);
  }

  @Cron(process.env.CRON_UPDATE_RANK || '')
  public handleUpdateRank() {
    return this._amqpLearningService.handleUpdateRank();
  }

  @Cron(process.env.CRON_RESET_EXP_DATE || '')
  public handleResetExpDate() {
    return this._amqpLearningService.handleResetExpDate();
  }
}

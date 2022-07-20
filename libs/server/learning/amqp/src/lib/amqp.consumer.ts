/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NotificationType } from '@els/server/learning/common';
import { CronService } from '@els/server/learning/cron/data-access/services';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
@Injectable()
export class AmqpConsumer {
  constructor(private readonly _cronService: CronService) {}
  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'actual_skill_history.cmd.create.worker.learning',
    queue: 'phpswteam.els-actual_skill_history.cmd.create.worker.learning',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  public handleCreateActualSkillHistory() {
    this._cronService.handleCreateActualSkillHistory();
  }

  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'memory_analysis.cmd.calc.worker.learning',
    queue: 'phpswteam.els-memory_analysis.cmd.calc.worker.learning',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  public handleCalcMemoryAnalysis() {
    this._cronService.handleCalcMemoryAnalysis();
  }
  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'actual_skill.cmd.reduce.worker.learning',
    queue: 'phpswteam.els-actual_skill.cmd.reduce.worker.learning',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  public handleReduceLevelActualSkill() {
    this._cronService.handleReduceLevelActualSkill();
  }

  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'assigned_mission.cmd.create.worker.learning',
    queue: 'phpswteam.els-assigned_mission.cmd.create.worker.learning',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  public handleAssignMission() {
    this._cronService.handleAssignMission();
  }

  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'streak_list.cmd.update.worker.learning',
    queue: 'phpswteam.els-streak_list.cmd.update.worker.learning',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  public handleInactiveStreakList() {
    this._cronService.handleInactivateStreakList();
  }

  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'notification.cmd.*.worker.learning',
    queue: 'phpswteam.els-notification.cmd.notify.worker.learning',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  public handleNotify(msg: any, consumeMessage: ConsumeMessage) {
    const notificationType: NotificationType = consumeMessage.fields.routingKey
      .split('.')[2]
      .replace(/_/gi, '-') as NotificationType;
    switch (notificationType) {
      case NotificationType.REMIND_PRACTICE_MORNING: {
        this._cronService.handleRemindPracticeMorning();
        break;
      }
      case NotificationType.REMIND_PRACTICE_AFTERNOON: {
        this._cronService.handleRemindPracticeAfternoon();
        break;
      }
      case NotificationType.REMIND_PRACTICE_EVENING: {
        this._cronService.handleRemindPracticeEvening();
        break;
      }
      case NotificationType.REMIND_PRACTICE_MIDNIGHT: {
        this._cronService.handleRemindPracticeMidnight();
        break;
      }
      case NotificationType.REMIND_COMEBACK: {
        this._cronService.handleRemindComeBack();
        break;
      }
      case NotificationType.COMPLAIN_1: {
        this._cronService.handleComplain1();
        break;
      }
      default:
        break;
    }
  }

  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'rank.cmd.update.worker.learning',
    queue: 'phpswteam.els-rank.cmd.update.worker.learning',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleUpdateRank(msg: any, consumeMessage: ConsumeMessage) {
    this._cronService.handleUpdateRank();
  }

  @RabbitSubscribe({
    exchange: 'phpswteam.els',
    routingKey: 'exp_date.cmd.reset.worker.learning',
    queue: 'phpswteam.els-exp_date.cmd.reset.worker.learning',
    queueOptions: {
      deadLetterExchange: 'phpswteam.dlx_els',
      deadLetterRoutingKey: 'dlx.log',
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleResetExpDate(msg: any, consumeMessage: ConsumeMessage) {
    this._cronService.handleResetExpDate();
  }
}

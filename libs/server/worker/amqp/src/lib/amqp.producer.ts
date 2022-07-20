import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { NotificationType } from '@els/server/worker/common';

@Injectable()
export class AmqpProducer {
  constructor(private readonly _amqpConnection: AmqpConnection) {}
  public handleCreateActualSkillHistory() {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'actual_skill_history.cmd.create.worker.learning',
      {}
    );
  }

  public handleCalcMemoryAnalysis() {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'memory_analysis.cmd.calc.worker.learning',
      {}
    );
  }

  public handleReduceLevelActualSkill() {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'actual_skill.cmd.reduce.worker.learning',
      {}
    );
  }

  public handleAssignMission() {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'assigned_mission.cmd.create.worker.learning',
      {}
    );
  }

  public handleInactiveStreakList() {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'streak_list.cmd.update.worker.learning',
      {}
    );
  }

  public handleNotify(notificationType: NotificationType) {
    return this._amqpConnection.publish(
      'phpswteam.els',
      `notification.cmd.${notificationType.replace(/-/g, '_')}.worker.learning`,
      {}
    );
  }

  public handleUpdateRank() {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'rank.cmd.update.worker.learning',
      {}
    );
  }
  public handleResetExpDate() {
    return this._amqpConnection.publish(
      'phpswteam.els',
      'exp_date.cmd.reset.worker.learning',
      {}
    );
  }
}

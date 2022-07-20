/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AmqpProducer } from '../amqp.producer';
import { Injectable } from '@nestjs/common';
import { NotificationType } from '@els/server/worker/common';
@Injectable()
export class AmqpLearningService {
  constructor(
    private readonly _amqpProducer: AmqpProducer,
  ) {}
  public handleCreateActualSkillHistory() {
    return this._amqpProducer.handleCreateActualSkillHistory();
  }

  public handleCalcMemoryAnalysis() {
    return this._amqpProducer.handleCalcMemoryAnalysis();
  }

  public handleReduceLevelMemoryAnalysis(){
    return this._amqpProducer.handleReduceLevelActualSkill();
  }

  public handleAssignMission(){
    return this._amqpProducer.handleAssignMission();
  }

  public handleInactiveStreakList(){
    return this._amqpProducer.handleInactiveStreakList();
  }

  public handleNotify(notificationType: NotificationType){
    return this._amqpProducer.handleNotify(notificationType);
  }

  public handleUpdateRank(){
    return this._amqpProducer.handleUpdateRank();
  }

  public handleResetExpDate() {
    return this._amqpProducer.handleResetExpDate();
  }
}

import { AssignedMissionStatus, Repeatable } from '@els/server/learning/common';
import { ViewEntity, ViewColumn, Connection } from 'typeorm';
import { AssignedMission } from './assigned-mission.entity';
import { Mission } from './mission.entity';
@ViewEntity({
  expression: (connection: Connection) =>
    connection
      .createQueryBuilder()
      .select('assignedMission.id', 'id')
      .addSelect('assignedMission.userId', 'userId')
      .addSelect('assignedMission.status', 'status')
      .addSelect('assignedMission.assignedAt', 'assignedAt')
      .addSelect('mission.repeatable', 'repeatable')
      .from(AssignedMission, 'assignedMission')
      .leftJoin(Mission, 'mission', 'mission.id = assignedMission.missionId'),
})
export class AssignedMissionMission {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  status!: AssignedMissionStatus;

  @ViewColumn()
  repeatable!: Repeatable;

  @ViewColumn()
  userId!: string;

  @ViewColumn()
  assignedAt!: Date;

}
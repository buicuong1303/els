/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import {
  MissionTarget,
  User,
} from '@els/server/learning/user/data-access/entities';
import { Mission } from '..';
import { AssignedMissionStatus } from '@els/server/learning/common';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class AssignedMission extends BaseEntity implements BaseType {
  @Field(() => Int)
  @Column({ default: 0 })
  currentProgress!: number;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'timestamptz' })
  completedAt?: Date;

  @Field()
  @Column({ type: 'timestamptz' })
  assignedAt!: Date;

  @Field(() => Int)
  @Column()
  maxProgress!: number;

  @Field({ nullable: true })
  @Column({ nullable: true,  type: 'timestamptz' })
  expiredAt?: Date | null;

  @Field(() => AssignedMissionStatus)
  @Column({ type: 'varchar', default: 'in_progress'})
  status!: AssignedMissionStatus;

  @Field(() => Mission)
  @ManyToOne(() => Mission, (mission) => mission.assignedMissions)
  mission!: Mission;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.assignedMissions)
  user!: User;

  @Field(() => MissionTarget, { nullable: true })
  @ManyToOne(
    () => MissionTarget,
    (missionTarget) => missionTarget.assignedMissions,
    { nullable: true }
  )
  missionTarget?: MissionTarget | null;

  @HideField()
  @Column('uuid', { nullable: true })
  userId?: string | null;

  @HideField()
  @Column('uuid', { nullable: true })
  @Index(['missionId', 'userId'], {
    unique: true,
    where: '\'missionTargetId\' IS NULL',
  })
  missionId?: string | null;

  @HideField()
  @Column('uuid', { nullable: true })
  missionTargetId?: string | null;
}

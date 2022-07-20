/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import {
  AssignedMission,
  Mission
} from '@els/server/learning/mission/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { User } from '..';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
@Index(['missionId', 'userId', 'studentId'], {
  unique: true,
  where: '\'studentId\' IS NOT NULL',
})
@Index(['missionId', 'userId'], {
  unique: true,
  where: '\'studentId\' IS NULL',
})
export class MissionTarget extends BaseEntity implements BaseType {
  @Field(() => Int)
  @Column()
  maxProgress!: number;

  @Field()
  @Column({ default: 'active' })
  status!: string;

  @Field(() => Mission)
  @ManyToOne(() => Mission, (mission) => mission.missionTargets)
  mission!: Mission;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.missionTargets, { nullable: true })
  user?: User;

  @Field(() => Enrollment, { nullable: true })
  @ManyToOne(() => Enrollment, (enrollment) => enrollment.missionTargets, {
    nullable: true,
  })
  student?: Enrollment;

  @Field(() => [AssignedMission])
  @OneToMany(
    () => AssignedMission,
    (assignedMission) => assignedMission.missionTarget
  )
  assignedMissions?: AssignedMission[];

  @HideField()
  @Column('uuid', { nullable: true })
  studentId?: string;

  @HideField()
  @Column('uuid', { nullable: true })
  userId?: string;

  @HideField()
  @Column('uuid', { nullable: true })
  missionId?: string;
}

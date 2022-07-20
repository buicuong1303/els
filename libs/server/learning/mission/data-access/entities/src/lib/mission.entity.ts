/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { AvailableMission } from '@els/server/learning/available-mission/data-access/entities';
import { MissionCode } from '@els/server/learning/common';
import { MissionTarget } from '@els/server/learning/user/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AssignedMission } from '..';
import { Reward } from './reward.entity';

export enum Repeatable {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  NONE = 'none',
  TIMES = 'times'
}

export enum Type {
  OPTIONAL = 'optional',
  SYSTEM = 'system',
}

//* automatic or manual receive reward
export enum Mode {
  MANUAL = 'manual',
  AUTO = 'auto',
}
@Entity()
@Unique(['code'])
@ObjectType({
  implements: () => [BaseType],
})
export class Mission extends BaseEntity implements BaseType {
  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  titleEn?: string;

  @Field(() => MissionCode)
  @Column({type: 'text', nullable: true})
  code!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @Column({default: ''})
  repeatable!: string;

  // * how many times can assigned to the user. 1,2 or infinity
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  cooldownTime?: number;

  //* the period from assigned to expired
  //* expired_time = assigned_time + duration_hours
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  durationHours?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  iconUri?: string;

  @Field(() => Int)
  @Column()
  maxProgress!: number;

  @Field()
  @Column({ nullable: true})
  mode!: string;


  @Field(() => Reward)
  @ManyToOne(() => Reward, reward => reward.missions)
  reward!: Reward;

  @Field(() => [AssignedMission])
  @OneToMany(() => AssignedMission, (assignedMission) => assignedMission.mission)
  assignedMissions?:  AssignedMission[];

  @Field(() => [MissionTarget])
  @OneToMany(() => MissionTarget, (missionTarget) => missionTarget.mission)
  missionTargets?: MissionTarget[];


  @Field(() => [AvailableMission])
  @OneToMany(() => AvailableMission, (availableMission) => availableMission.mission)
  availableMissions?: AvailableMission[];

  @HideField()
  @Column('uuid', { nullable: true })
  rewardId?: string;

  @Field()
  @Column( { nullable: true })
  type!: string;
}

/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field, HideField, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import { Wordbook } from '@els/server/learning/wordbook/data-access/entities';
import { AssignedMission } from '@els/server/learning/mission/data-access/entities';
import {
  StreakList,
} from '@els/server/learning/streak/data-access/entities';
import { Device } from '@els/server/learning/device/data-access/entities';
import { MissionTarget } from './mission-target.entity';
import { nextLevel } from '@els/server/learning/utils';
import { BaseEntity, BaseType, JSONType } from '@els/server/shared';
import { AccountIdentity } from './account-identity.entity';
import { Rank } from '@els/server/learning/rank/data-access/entities';
import { Notification, NotificationChange } from '@els/server/learning/notification/data-access/entities';
import { MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { Setting } from '@els/server/learning/setting/data-access/entities';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
@Directive('@key(fields: "id")')
export class User extends BaseEntity implements BaseType {
  @Field(() => Int)
  @Column({ default: 1 })
  level!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  exp!: number;

  @Field(() => Int)
  @Column({ default: nextLevel(2) })
  nextLevelExp!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  expDate!: number;

  @Field()
  @Column('uuid', { nullable: true })
  identityId!: string;

  @Field(() => [Enrollment])
  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments?: Enrollment[];

  @Field(() => [Device])
  @OneToMany(() => Device, (device) => device.user)
  devices?: Device[];

  @Field(() => [Wordbook])
  @OneToMany(() => Wordbook, (wordbook) => wordbook.user)
  wordbooks?: Wordbook[];

  @Field(() => [StreakList], { nullable: true })
  @OneToMany(() => StreakList, (streak) => streak.user)
  streakLists?: StreakList[];

  @Field(() => [AssignedMission])
  @OneToMany(() => AssignedMission, (assignedMission) => assignedMission.user)
  assignedMissions?: AssignedMission[];

  @Field(() => User)
  @ManyToOne(() => User, user => user.listInvited)
  userInvited?: User;

  @Field(() => [User])
  @OneToMany(() => User, user => user.userInvited)
  listInvited?: User[];

  @Field(() => [Rank])
  @OneToMany(() => Rank, (rank) => rank.user)
  rank?: Rank[];

  @Field(() => [MissionTarget])
  @OneToMany(() => MissionTarget, (missionTarget) => missionTarget.user)
  missionTargets?: MissionTarget[];

  @Field(() => [Notification])
  @OneToMany(() => Notification, (notification) => notification.notifier)
  notifications?: Notification[];

  @Field(() => [NotificationChange])
  @OneToMany(() => NotificationChange, (notificationChange) => notificationChange.actor)
  notificationChanges?: NotificationChange[];

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  ignoredWords?: string[];

  @HideField()
  @Column('uuid', { nullable: true })
  knowledgeId?: string;

  @Field(() => AccountIdentity)
  identity?: AccountIdentity;

  @Field(() => JSONType, { nullable: true })
  memoryFluctuations!: JSONType;

  @Field(() => JSONType, { nullable: true })
  extraInfo!: JSONType;

  @Field(() => [MemoryAnalysis], { nullable: true })
  memoryAnalyses!: MemoryAnalysis[];

  @Field(() => JSONType, { nullable: true })
  @OneToOne(() => Setting, (setting) => setting.user, { onDelete: 'CASCADE', nullable: true})
  @JoinColumn()
  setting?: Setting;
}

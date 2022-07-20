/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { User } from '@els/server/learning/user/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Streak } from './streak.entity';

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class StreakList extends BaseEntity implements BaseType {
 
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.streakLists)
  user!: User;

  @Field(() => [Streak])
  @OneToMany(() => Streak, (streakNode) => streakNode.streakList)
  streaks!: Streak[];

  @Field()
  @Column({ nullable: true, default: 'active' })
  status!: string;

  @HideField()
  @Column('uuid')
  userId!: string;
}

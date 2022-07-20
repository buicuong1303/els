/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field, HideField, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { StreakList } from '@els/server/learning/streak/data-access/entities';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Streak extends BaseEntity implements BaseType {
 
  @Field(() => StreakList)
  @ManyToOne(() => StreakList, (streakList) => streakList.streaks)
  streakList!: StreakList;

  @Field(() => Int)
  @Column({ default: 0 })
  expDate!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  expTarget!: number;

  @HideField()
  @Column('uuid')
  streakListId!: string;
}

/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { RewardUnit } from '@els/server/learning/reward-unit/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Mission } from './mission.entity';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Reward extends BaseEntity implements BaseType {
  @Field(() => Int)
  @Column({ type: 'int4'})
  value!: number;

  @Field(() => RewardUnit)
  @ManyToOne(() => RewardUnit, (rewardUnit) => rewardUnit.rewards)
  rewardUnit!: RewardUnit;

  @Field({ nullable: true})
  @Column({ nullable: true})
  description?: string;

  @Field(() => Mission)
  @OneToMany(() => Mission, mission => mission.reward) // specify inverse side as a second parameter
  missions?: Mission[];

  @HideField()
  @Column('uuid', { nullable: true})
  rewardUnitId?: string;

}

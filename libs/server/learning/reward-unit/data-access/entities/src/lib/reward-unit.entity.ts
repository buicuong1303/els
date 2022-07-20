/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { Reward } from '@els/server/learning/mission/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
@Entity()
@Unique(['code'])
@ObjectType({
  implements: () => [BaseType],
})
export class RewardUnit extends BaseEntity implements BaseType {
  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  code!: string;

  @Field({ nullable: true})
  @Column({ nullable: true})
  description?: string;

  @Field(() => [Reward], { nullable: true})
  @OneToMany(() => Reward, (reward) => reward.rewardUnit)
  rewards?: Reward[];
}

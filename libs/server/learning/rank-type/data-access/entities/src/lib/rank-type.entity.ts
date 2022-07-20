/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Rank } from '@els/server/learning/common';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class RankType extends BaseEntity implements BaseType {

  @Field({ nullable: true})
  @Column({ default: '' })
  name?: string;

  @Field(() => [Rank])
  @OneToMany(() => Rank, (rank) => rank.rankType)
  rank?: Rank[];

}

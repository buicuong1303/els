/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
} from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class RankLog extends BaseEntity implements BaseType {

  @Field({ nullable: true})
  @Column({ default: 0 })
  rankNumber?: number;

  @Field({ nullable: true })
  @Column({ default: 0 })
  elo?: number;

  @Field({ nullable: true})
  @Column({ default: '' })
  userId?: string;

  @Field({ nullable: true})
  @Column({ default: '' })
  rankTypeId?: string;

}

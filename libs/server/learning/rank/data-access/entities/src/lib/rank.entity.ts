/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { User } from '@els/server/learning/user/data-access/entities';
import { RankType } from '@els/server/learning/rank-type/data-access/entities';

@ObjectType()
export class RankElo {
  @Field({ nullable: true})
  word?: number;

  @Field({ nullable: true})
  topic?: number;

  @Field({ nullable: true})
  exp?: number;

  @Field({ nullable: true})
  nextExp?: number;

  @Field({ nullable: true})
  level?: number;
}

@ObjectType()
export class RankUserInfo {
  @Field({ nullable: true })
  attendance?: number;

  @Field({ nullable: true })
  currentStreak?: number;

  @Field({ nullable: true })
  fromLang?: string;

  @Field({ nullable: true })
  learningLang?: string;

  @Field({nullable: true, defaultValue: new RankElo()})
  rankInfo!: RankElo;

  @Field(() => User, {nullable: true})
  userInfo!: User;
}

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Rank extends BaseEntity implements BaseType {

  @Field({ nullable: true})
  @Column({nullable: true })
  number?: number;

  @Field({ nullable: true })
  @Column({default: 0 })
  numberChange?: number;

  @Field({ nullable: true })
  @Column('jsonb', {nullable: true})
  elo?: RankElo;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.rank)
  user!: User;

  @Field(() => RankType)
  @ManyToOne(() => RankType, (rankType) => rankType.rank)
  rankType!: RankType;
}

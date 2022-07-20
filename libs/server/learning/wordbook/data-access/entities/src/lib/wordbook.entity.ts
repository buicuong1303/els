/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Vocabulary } from '@els/server/learning/common';
import { User } from '@els/server/learning/user/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Wordbook extends BaseEntity implements BaseType {

  @Field()
  @Column()
  name!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.wordbooks)
  user!: User;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { default: '' })
  bookmarkWords!: string[];

  @HideField()
  @Column('uuid', { nullable: true })
  userId?: string;

  @Field(() => [Vocabulary], { nullable: true })
  vocabularies!: Vocabulary[];
}

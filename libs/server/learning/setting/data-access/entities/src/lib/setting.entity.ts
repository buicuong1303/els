/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field, HideField } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToOne,
} from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { User } from '@els/server/learning/user/data-access/entities';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Setting extends BaseEntity implements BaseType {
  @Field({ nullable: true})
  @Column({ default: 'vi' })
  fromLang?: string;

  @Field({ nullable: true})
  @Column({ default: 'en' })
  learningLang?: string;

  @Field({ nullable: true})
  @Column({ default: true })
  speak?: boolean;

  @Field({ nullable: true})
  @Column({ default: true })
  listen?: boolean;

  @Field({ nullable: true})
  @Column({ default: true })
  sound?: boolean;

  @Field({ nullable: true})
  @Column({ default: true })
  notification?: boolean;

  @Field({ nullable: true})
  @Column({ default: 50 })
  exp!: number;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.setting, { cascade: true })
  user!: User;

  @HideField()
  @Column('uuid', { nullable: true })
  userId?: string;
}

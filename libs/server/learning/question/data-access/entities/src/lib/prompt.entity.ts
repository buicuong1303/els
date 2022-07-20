/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Topic } from '@els/server/learning/common';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity, ManyToOne, OneToOne
} from 'typeorm';
import { Question } from '..';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Prompt extends BaseEntity implements BaseType {
  @Field({ nullable: true})
  @Column({ nullable: true })
  text?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  video?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  audio?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Field(() => Question)
  @OneToOne(() => Question, question => question.prompt, { cascade: true })
  question!: Question;

  @Field(() => Topic)
  @ManyToOne(() => Topic, (topic) => topic.prompts, {
    onDelete: 'CASCADE',
  })
  topic!: Topic;

  @HideField()
  @Column('uuid', { nullable: true })
  topicId?: string;
}

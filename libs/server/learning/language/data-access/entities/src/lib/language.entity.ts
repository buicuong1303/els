/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { BaseLang } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { ChildEntity, OneToMany } from 'typeorm';
@ChildEntity()
@ObjectType()
export class Language extends BaseLang {

  @Field(() => [Topic])
  @OneToMany(() => Topic, (topic) => topic.learningLang)
  learningTopics!: Topic[];

  @Field(() => [Topic])
  @OneToMany(() => Topic, (topic) => topic.fromLang)
  fromTopics!: Topic[];
}

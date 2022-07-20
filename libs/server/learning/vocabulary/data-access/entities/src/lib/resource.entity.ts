/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ResourceCategory, Topic } from '@els/server/learning/common';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Vocabulary } from './vocabulary.entity';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Resource extends BaseEntity implements BaseType {
  @Field(() => ResourceCategory)
  @Column({ type: 'varchar' })
  category!: ResourceCategory;

  @Field()
  @Column({ nullable: true })
  uri?: string;

  @Field()
  @Column({ nullable: true })
  transcript?: string;

  @Field()
  @Column({ nullable: true })
  translation?: string;

  @Field()
  @Column({ default: false })
  isWord!: boolean;

  @Field(() => Vocabulary)
  @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.resources, {
    onDelete: 'CASCADE',
  })
  vocabulary!: Vocabulary;

  @HideField()
  @Column('uuid')
  vocabularyId!: string;

  @Field(() => Topic)
  @ManyToOne(() => Topic, (topic) => topic.resources, {
    onDelete: 'CASCADE',
  })
  topic!: Topic;

  @HideField()
  @Column('uuid')
  topicId!: string;
}

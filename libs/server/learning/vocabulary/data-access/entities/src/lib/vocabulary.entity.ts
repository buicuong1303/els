/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field, HideField, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';

import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { Question } from '@els/server/learning/question/data-access/entities';
import { Resource } from './resource.entity';
import { Word, Phrase } from '..';
import { ReferenceUnion } from './reference-union.entity';
@Entity()
@Unique(['topicId', 'vocabulary', 'pos'])
@ObjectType({
  implements: () => [BaseType],
})
export class Vocabulary extends BaseEntity implements BaseType {
  @Field()
  @Column()
  vocabulary!: string;

  @Field()
  @Column()
  translation!: string;

  @Field()
  @Column({ default: '' })
  memoryLevel?: string;

  @Field()
  @Column()
  pos!: string;

  @Field()
  @Column()
  phonetic!: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 1})
  level!: number;

  @Field()
  @Column({ default: 'word' })
  type!: string;

  @Field(() => Topic)
  @ManyToOne(() => Topic, (topic) => topic.vocabularies, {
    onDelete: 'CASCADE',
  })
  topic!: Topic;

  @HideField()
  @Column('uuid', { nullable: true })
  topicId?: string;

  @HideField()
  @Column('uuid', { nullable: true })
  lessonId?: string;

  @Field(() => Lesson)
  @ManyToOne(() => Lesson, (lesson) => lesson.vocabularies, {
    onDelete: 'CASCADE',
  })
  lesson!: Lesson;

  @Field(() => [Resource])
  @OneToMany(() => Resource, (resource) => resource.vocabulary, {
    cascade: true,
  })
  resources?: Resource[];

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.vocabulary, {
    cascade: true,
  })
  questions?: Question[];

  @Field(() => [MemoryAnalysis])
  @OneToMany(
    () => MemoryAnalysis,
    (memoryAnalysis) => memoryAnalysis.vocabulary,
    { cascade: true }
  )
  memoryAnalyses?: MemoryAnalysis[];

  //-----------Federation----------------
  @Field({ nullable: true })
  @Column({ nullable: true })
  referenceId?: string;

  @Field(() => ReferenceUnion, { nullable: true })
  reference?: Word | Phrase;

  @Field(() => String, { nullable: true })
  audio?: string;

  @Field(() => String, { nullable: true })
  image?: string;
}

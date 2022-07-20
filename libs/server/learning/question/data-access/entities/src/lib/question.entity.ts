/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { QuestionAction, QuestionType } from '@els/server/learning/common';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne, OneToOne
} from 'typeorm';
import { Prompt } from './prompt.entity';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Question extends BaseEntity implements BaseType {
  @Field()
  @Column({ default: '' })
  correctAnswer!: string;

  @Field(() => Number)
  @Column({ default: 0 })
  duration?: number;

  @Field(() => String)
  @Column({ nullable: true })
  choices?: string;

  @Field(() => [String])
  @Column('text', { default: {}, array: true })
  skills?: string[];

  @Field(() => [String])
  @Column('text', { default: {}, array: true })
  equipments!: string[];

  @Field(() => String)
  @Column({ default: '' })
  sourceLang?: string;

  @Field(() => String)
  @Column({ default: '' })
  targetLang?: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 1})
  level!: number;

  @Field(() => QuestionAction)
  @Column({ type: 'varchar' })
  action?: QuestionAction;

  @Field(() => QuestionType)
  @Column({ type: 'varchar' })
  type?: QuestionType;

  @Field(() => Vocabulary)
  @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.questions, {
    onDelete: 'CASCADE',
  })
  vocabulary!: Vocabulary;

  @HideField()
  @Column('uuid', { nullable: true })
  vocabularyId?: string;

  @Field()
  @OneToOne(() => Prompt, prompt => prompt.question, { onDelete: 'CASCADE'})
  @JoinColumn()
  prompt!: Prompt;

  @HideField()
  @Column('uuid', { nullable: true })
  promptId?: string;
}

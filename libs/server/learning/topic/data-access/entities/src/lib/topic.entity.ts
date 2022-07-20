/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Category, Prompt, Resource } from '@els/server/learning/common';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import { Language } from '@els/server/learning/language/data-access/entities';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { Specialization } from '@els/server/learning/specialization/data-access/entities';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, Float, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Topic extends BaseEntity implements BaseType {
  @Field()
  @Column({ unique: true})
  name!: string;

  @Field()
  @Column({ default: '' })
  description!: string;

  @Field(() => Float)
  @Column('decimal', { precision: 5, scale: 1, default: 0 })
  rating!: number;


  @Field(() => Int)
  numberOfParticipants!: number;

  @Field(() => Specialization)
  @ManyToOne(() => Specialization, (spec) => spec.topics)
  specialization!: Specialization;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.topics)
  category!: Category;

  @Field(() => [Lesson])
  @OneToMany(() => Lesson, (lesson) => lesson.topic, {
    cascade: true,
  })
  lessons!: Lesson[];

  @Field()
  @Column({ default: '' })
  thumbnailUri!: string;

  @Field(() => [Vocabulary])
  @OneToMany(() => Vocabulary, (vocabulary) => vocabulary.topic)
  vocabularies?: Vocabulary[];

  @Field(() => [Resource])
  @OneToMany(() => Resource, (resource) => resource.topic)
  resources?: Resource[];

  @Field(() => [Prompt])
  @OneToMany(() => Prompt, (prompt) => prompt.topic)
  prompts?: Prompt[];

  @Field(() => [Enrollment], { nullable: true })
  @OneToMany(() => Enrollment, (enrollment) => enrollment.topic)
  students?: Enrollment[];

  @Field(() => Language)
  @ManyToOne(() => Language, (lang) => lang.learningTopics)
  learningLang!: Language;

  @Field(() => Language)
  @ManyToOne(() => Language, (lang) => lang.fromTopics)
  fromLang!: Language;

  @HideField()
  @Column('uuid', { nullable: true })
  fromLangId?: string;

  @HideField()
  @Column('uuid', { nullable: true })
  learningLangId?: string;

  @HideField()
  @Column('uuid', { nullable: true })
  specializationId?: string;

  @HideField()
  @Column('uuid', { nullable: true })
  categoryId?: string;

  @Field({nullable: true})
  lastStudiedAt?: Date;

}

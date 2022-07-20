/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { MemoryStatus, UnTrackingMode } from '@els/server/learning/common';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { ActualSkill } from './actual-skill.entity';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
@Unique(['vocabularyId', 'studentId', 'lessonId'])
export class MemoryAnalysis extends BaseEntity implements BaseType {

  @Field(() => UnTrackingMode)
  @Column({ type: 'varchar', nullable: true })
  unTrackingMode?: UnTrackingMode | null;

  @Field(() => Boolean)
  @Column({ default: true })
  isFirstTime!: boolean;

  @Field(() => MemoryStatus)
  @Column('text')
  memoryStatus!: MemoryStatus;

  @Field(() => Vocabulary)
  @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.memoryAnalyses)
  vocabulary!: Vocabulary;

  @Field(() => Enrollment)
  @ManyToOne(() => Enrollment, (enrollment) => enrollment.memoryAnalyses)
  student!: Enrollment;
  
  @Field(() => Lesson)
  @ManyToOne(() => Lesson, (lesson) => lesson.memoryAnalyses)
  lesson!: Lesson;

  @Field()
  @Column({ type: 'timestamptz', nullable: true })
  lastStudiedAt!: Date;

  @Field()
  @Column({ type: 'timestamptz', nullable: true })
  lastChangedMemoryStatusAt!: Date;
  
  @Field(() => MemoryStatus, { nullable: true})
  @Column('text', { nullable: true})
  lastMemoryStatus?:MemoryStatus;

  @Field(() => [ActualSkill])
  @OneToMany(() => ActualSkill, (actualSkill) => actualSkill.memoryAnalysis)
  actualSkills!: ActualSkill[];

  @HideField()
  @Column('uuid', { nullable: true })
  vocabularyId?: string;

  @HideField()
  @Column('uuid', { nullable: true })
  studentId?: string;

  @HideField()
  @Column('uuid', { nullable: true })
  lessonId?: string;
}

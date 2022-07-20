/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Lesson extends BaseEntity implements BaseType {
  @Field()
  @Column()
  name!: string;

  @Field(() => Topic)
  @ManyToOne(() => Topic, (topic) => topic.lessons, { onDelete: 'CASCADE' })
  topic!: Topic;

  @HideField()
  @Column('uuid', { nullable: true })
  topicId?: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 1})
  level!: number;

  @Field(() => [Vocabulary])
  @OneToMany(() => Vocabulary, (vocabulary) => vocabulary.lesson)
  vocabularies?: Vocabulary[];

  @Field(() => [MemoryAnalysis])
  @OneToMany(() => MemoryAnalysis, (memoryAnalysis) => memoryAnalysis.lesson)
  memoryAnalyses?: MemoryAnalysis[];
}

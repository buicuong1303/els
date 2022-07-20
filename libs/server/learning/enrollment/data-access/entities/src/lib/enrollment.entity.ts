/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field, HideField } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity, BaseType, JSONType } from '@els/server/shared';

import { Topic } from '@els/server/learning/topic/data-access/entities';
import { User } from 'libs/server/learning/user/data-access/entities/src/lib/user.entity';
import { MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { MissionTarget } from '@els/server/learning/user/data-access/entities';

@ObjectType()
export class SummaryMemoryStatus {
  @Field(() => [String], { nullable: true })
  newVocabularies!: string[];

  @Field(() => [String], { nullable: true })
  forgotVocabularies!: string[];

  @Field(() => [String], { nullable: true })
  vagueVocabularies!: string[];

  @Field(() => [String], { nullable: true })
  memorizedVocabularies!: string[];
}

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
@Unique(['topicId', 'userId'])
export class Enrollment extends BaseEntity implements BaseType {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.enrollments)
  user!: User;

  @HideField()
  @Column('uuid', { nullable: true })
  userId!: string;

  @OneToMany(() => MemoryAnalysis, (memoryAnalysis) => memoryAnalysis.student)
  memoryAnalyses?: MemoryAnalysis[];

  @OneToMany(() => MissionTarget, (missionTarget) => missionTarget.student)
  missionTargets?: MissionTarget[];

  @Field(() => Topic)
  @ManyToOne(() => Topic, (topic) => topic.students)
  topic!: Topic;

  @HideField()
  @Column('uuid', { nullable: true })
  topicId?: string;

  @Field(() => SummaryMemoryStatus, { nullable: true })
  summaryMemoryStatus?: SummaryMemoryStatus;

  @Field(() => JSONType, { nullable: true })
  memoryFluctuations!: JSONType;

  @Field(() => JSONType, { nullable: true })
  summarySkill!: JSONType;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  lastActivityAt!: Date;

  @Field(() => Boolean)
  @Column({ default: false })
  isCompleted!: boolean;
}

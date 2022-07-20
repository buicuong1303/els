/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities';
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, Float, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MemoryAnalysis } from '..';
import { ActualSkillHistory } from './actual-skill-history.entity';


@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class ActualSkill extends BaseEntity implements BaseType {

  @Field(() => Int)
  @Column({default: 0})
  currentLevel!: number;

  @Field(() => Float)
  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  percent!: number;

  @HideField()
  @Column('uuid', { nullable: true })
  memoryAnalysisId?: string;

  @Field(() => MemoryAnalysis)
  @ManyToOne(() => MemoryAnalysis, (memoryAnalysis) => memoryAnalysis.actualSkills)
  memoryAnalysis!: MemoryAnalysis;

  @Field(() => SkillLevel)
  @ManyToOne(() => SkillLevel, (skillLevel) => skillLevel.actualSkills, { nullable: true})
  skillLevel!: SkillLevel; 

  @Field(() => [ActualSkillHistory])
  @OneToMany(() => ActualSkillHistory, (actualSkillHistory) => actualSkillHistory.actualSkill)
  actualSkillHistories?: ActualSkillHistory[];

  @HideField()
  @Column('uuid', { nullable: true })
  skillLevelId?: string;

  @Field(() => Skill)
  @ManyToOne(() => Skill, (skill) => skill.actualSkills)
  skill!: Skill;

  @HideField()
  @Column('uuid', { nullable: true })
  skillId?: string;

  @Column({ default:  new Date(), type: 'timestamptz'})
  levelUpAt!: Date;

  @Column({ nullable: true, type: 'timestamptz'})
  levelDownAt!: Date;

}

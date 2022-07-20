/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities';
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, Float, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ActualSkill, MemoryAnalysis } from '..';


@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class ActualSkillHistory extends BaseEntity implements BaseType {

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


  @HideField()
  @Column('uuid', { nullable: true })
  skillLevelId?: string;

  @Field(() => ActualSkill)
  @ManyToOne(() => ActualSkill, (actualSkill) => actualSkill.actualSkillHistories)
  actualSkill!: ActualSkill;

  @HideField()
  @Column('uuid', { nullable: true })
  actualSkillId?: string;

  @Field(() => Skill)
  @ManyToOne(() => Skill, (skill) => skill.actualSkills)
  skill!: Skill;

  @HideField()
  @Column('uuid', { nullable: true })
  skillId?: string;

  @Column({ default:  new Date(), type: 'timestamptz'})
  levelUpAt!: Date;

}

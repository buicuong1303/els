/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Level } from '@els/server/learning/level/data-access/entities';
import { ActualSkill } from '@els/server/learning/memory-analysis/data-access/entities';
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, Float, HideField, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  Unique
} from 'typeorm';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
@Unique(['levelId', 'skillId'])
export class SkillLevel extends BaseEntity implements BaseType {

  @Field(() => Float)
  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  alpha!: number;


  @Field(() => Skill)
  @ManyToOne(() => Skill, (skill) => skill.skillLevels)
  skill!: Skill;


  @Field(() => Level)
  @ManyToOne(() => Level, (level) => level.skillLevels)
  level!: Level;

  @Field(() => [ActualSkill])
  @OneToMany(() => ActualSkill, (actualSkill) => actualSkill.skillLevel)
  actualSkills?: ActualSkill[];
    
  @HideField()
  @Column('uuid', { nullable: true })
  levelId?: string;

  
  @HideField()
  @Column('uuid', { nullable: true })
  skillId?: string;

}

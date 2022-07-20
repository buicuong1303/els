/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ActualSkill } from '@els/server/learning/memory-analysis/data-access/entities';
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
  Unique
} from 'typeorm';
@Entity()
@ObjectType({
  implements: () => [BaseType],
})
@Unique(['name'])
export class Skill extends BaseEntity implements BaseType {
  @Field()
  @Column()
  name!: string;

  @Field(() => SkillLevel)
  @OneToMany(() => SkillLevel, (skillLevel) => skillLevel.skill)
  skillLevels?: SkillLevel[];


  @Field(() => ActualSkill, { nullable: true })
  @OneToMany(() => ActualSkill, (skillLevel) => skillLevel.skill)
  actualSkills?: ActualSkill[];
}

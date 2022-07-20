import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities';

@Entity()
@Unique(['level'])
@ObjectType({
  implements: () => [BaseType],
})
export class Level extends BaseEntity implements BaseType {
  @Field(() => Int)
  @Column()
  level!: number;

  @Field(() => [SkillLevel])
  @OneToMany(() => SkillLevel, (skillLevel) => skillLevel.level)
  skillLevels?: SkillLevel[];
}

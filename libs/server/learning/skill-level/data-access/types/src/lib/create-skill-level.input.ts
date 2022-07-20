import { Field, Float, InputType, Int } from '@nestjs/graphql';
@InputType()
export class CreateSkillLevelInput {
  @Field(() => Float)
  alpha!: number

  @Field()
  skillId!: string

  @Field()
  levelId!: string
}
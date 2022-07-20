import { Field, Float, InputType, Int } from '@nestjs/graphql';
@InputType()
export class UpdateSkillLevelInput {

  @Field(() => Float)
  alpha!: number

  @Field()
  skillLevelId!: string

}
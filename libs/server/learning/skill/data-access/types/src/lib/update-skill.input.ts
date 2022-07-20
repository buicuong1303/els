import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class UpdateSkillInput {
  @Field(() => String)
  name!: string;

  @Field()
  skillId!: string;
}
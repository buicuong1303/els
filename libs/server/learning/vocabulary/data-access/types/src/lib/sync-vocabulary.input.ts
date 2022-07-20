import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GenerateResourceInput {
  @Field(() => String)
  category!: string;

  @Field(() => String, { nullable: true })
  topicId!: string;
}

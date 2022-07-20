import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateTopicInput {
  @Field()
  name!: string;

  @Field()
  specializationId!: string;


  @Field()
  thumbnail!: string;


  @Field((type) => String, { nullable: true})
  description?: string;
}

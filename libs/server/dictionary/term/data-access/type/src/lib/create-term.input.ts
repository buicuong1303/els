import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateTermInput {
  @Field()
  description?: string;
};

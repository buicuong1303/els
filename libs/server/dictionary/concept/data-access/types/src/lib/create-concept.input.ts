import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateConceptInput {
  @Field()
  description?: string;
};

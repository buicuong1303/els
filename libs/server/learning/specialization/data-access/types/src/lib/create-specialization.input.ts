import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSpecializationInput {

  @Field()
  name!: string;

  @Field({nullable: true})
  description?: string;
}

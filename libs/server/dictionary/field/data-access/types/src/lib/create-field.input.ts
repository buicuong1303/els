import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateFieldInput {
  @Field()
  name!: string;

  @Field({nullable: true})
  description?: string;
};

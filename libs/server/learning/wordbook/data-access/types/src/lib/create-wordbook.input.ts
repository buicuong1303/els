import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateWordBookInput {
  @Field()
  name!: string;

  @Field()
  userId!: string;

}

import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class RemoveWordInput {
  @Field()
  userId!: string;

  @Field()
  word!: string;
}

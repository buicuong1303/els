import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class DeleteTopicsInput  {
  @Field(() => [String])
  ids!: string[];

}

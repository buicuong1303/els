import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class RestoreTopicsInput  {
  @Field(() => [String])
  ids!: string[];
}

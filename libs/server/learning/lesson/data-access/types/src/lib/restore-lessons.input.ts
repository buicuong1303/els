import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class RestoreLessonsInput  {
  @Field(() => [String])
  ids!: string[];

}

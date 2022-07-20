import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class DeleteLessonsInput  {
  @Field(() => [String])
  ids!: string[];

}

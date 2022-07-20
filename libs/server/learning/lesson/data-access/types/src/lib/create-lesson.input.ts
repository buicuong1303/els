import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateLessonInput {
  @Field()
  name!: string;

  @Field()
  topicId!: string;
}

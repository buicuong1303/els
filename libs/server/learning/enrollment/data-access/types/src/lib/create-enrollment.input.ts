import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateEnrollmentInput {
  @Field()
  topicId!: string;
}

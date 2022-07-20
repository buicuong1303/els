import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetEnrollmentArgs {
  @Field()
  topicId!: string;
}

import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetCourseArgs {
  @Field({ nullable: true })
  id?: string;
}

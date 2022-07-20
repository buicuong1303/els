import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetCoursesArgs {
  @Field(() => [String])
  ids?: string[];
}

import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class FindWordArgs {
  @Field(() => String)
  search?: string;

  @Field(() => String)
  source?: string;

  @Field(() => String)
  target?: string;
}
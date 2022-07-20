import { pagination } from '@els/server/shared';
import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetRanksWithType extends pagination.offset.PaginationArgs {
  @Field(() => String)
  name?: string;
}
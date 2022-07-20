import { Field, ArgsType } from '@nestjs/graphql';
import { pagination } from '@els/server/shared';
@ArgsType()
export class GetWordArgs extends pagination.offset.PaginationArgs {
  @Field(() => [String], { nullable: 'itemsAndList' })
  ids?: string[];
}
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Field, ArgsType } from '@nestjs/graphql';
import { pagination } from '@els/server/shared';
@ArgsType()
export class GetTopicsArgs extends pagination.offset.PaginationArgs {
  @Field(() => [String], { nullable: 'itemsAndList' })
  ids?: string[];

  @Field(() => String, { nullable: true} )
  category?: string;

  @Field(() => [String], { nullable: true} )
  specs?: string[];

  @Field(() => String, { nullable: true} )
  name?: string;
}

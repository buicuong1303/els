import { ArgsType, Int, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class PaginationArgs {
  @Field(() => Int, { nullable: true })
  pageNumber!: number;

  @Field(() => Int, { nullable: true })
  limit!: number;

  @Field(() => [String], { nullable: true })
  ids?: any[];
}

import { ArgsType, Int, Field } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  first!: number;

  @Field(() => Int, { nullable: true })
  last!: number;

  @Field(() => String, { nullable: true })
  before!: string;

  @Field(() => String, { nullable: true })
  after!: string;

  @Field(() => String, { nullable: true })
  isAdmin?: any[];
}

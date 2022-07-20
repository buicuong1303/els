import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CursorPageInfo {
  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;

  @Field()
  hasPreviousPage!: boolean;

  @Field()
  hasNextPage!: boolean;

  @Field(() => Int)
  countTotal!: number;
}

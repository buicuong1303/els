import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class OffsetPageInfo {
  @Field(() => Int)
  total!: number;
}

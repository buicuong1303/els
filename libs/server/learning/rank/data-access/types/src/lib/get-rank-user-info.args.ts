import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetRankUserInfo{
  @Field(() => String)
  userId!: string;
}
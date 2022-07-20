import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetRankOfUser{
  @Field(() => String)
  rankType!: string;
}
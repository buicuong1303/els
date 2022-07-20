import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetMyTopicsArgs {
  @Field()
  userId!: string;
}

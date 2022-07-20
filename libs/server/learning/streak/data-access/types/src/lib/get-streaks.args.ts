import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetStreaksArgs {
  @Field()
  userId!: string;
}

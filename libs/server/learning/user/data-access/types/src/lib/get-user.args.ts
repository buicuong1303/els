import { ArgsType, Field} from '@nestjs/graphql';
@ArgsType()
export class GetUserArgs {
  @Field()
  userId!: string;
}
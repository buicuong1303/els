import { ArgsType, Field} from '@nestjs/graphql';
@ArgsType()
export class GetSummaryTopicsDetailsArgs {
  @Field()
  userId!: string;
}
import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetMyTopicDetailsArgs {

  @Field(() => [String], { nullable: 'itemsAndList' })
  studentIds?: string[];
}

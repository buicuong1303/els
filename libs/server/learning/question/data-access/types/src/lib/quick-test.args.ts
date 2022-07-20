import { Field, ArgsType } from '@nestjs/graphql';
import { Int } from 'type-graphql';
@ArgsType()
export class QuickTestArgs {
  @Field(() => [String], { nullable: 'itemsAndList' })
  topicIds!: string[];

  @Field(() => [String])
  equipments!: string[];

  @Field(() => Int)
  numberOfQuestions!: number;
}

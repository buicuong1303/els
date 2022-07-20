import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetQuestionArgs {
  @Field(() => [String], { nullable: 'itemsAndList' })
  vocabularyIds?: string[];

  @Field(() => [String])
  equipments!: string[];

  @Field(() => String,  { nullable: true })
  topicId?: string;
}

import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class GetVocabulariesInput {
  @Field(() => [String], { nullable: 'itemsAndList' })
  vocabularyIds?: string[];
}

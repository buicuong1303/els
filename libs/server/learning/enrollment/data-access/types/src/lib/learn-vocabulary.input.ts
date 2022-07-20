import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class LearnVocabularyInput {
  @Field()
  vocabularyId!: string;

  @Field()
  lessonId!: string;

  @Field(() => [String])
  skills!: string[];
}

/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { InputType, Field } from '@nestjs/graphql';
import { UnTrackingMode } from '@els/server/learning/common';
@InputType()
export class UnTrackVocabularyInput {
  @Field()
  vocabularyId!: string;

  @Field()
  topicId!: string;

  @Field(() => UnTrackingMode)
  unTrackingMode!: UnTrackingMode;
}

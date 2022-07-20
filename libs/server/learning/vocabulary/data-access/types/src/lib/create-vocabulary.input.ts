/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { POS } from '@els/server/learning/common';
import { Field, InputType } from '@nestjs/graphql';
import { CreateAudioResourceInput } from './create-audio-resource.input';
import { CreateSentenceResourceInput } from './create-sentence-resource.input';
import { CreateVideoResourceInput } from './create-video-resource.input';

@InputType()
export class CreateVocabularyInput {
  @Field()
  vocabulary!: string;

  @Field()
  translation!: string;

  @Field()
  phonetic!: string;

  @Field(() => POS)
  pos!: POS;

  @Field(() => String, { nullable: true })
  referenceId!: string;

  @Field(() => String, { nullable: true })
  memoryLevel?: string;

  @Field()
  topicId!: string;

  @Field()
  lessonsId!: string;

  @Field(() => [CreateVideoResourceInput], { nullable: true })
  videos?: CreateVideoResourceInput[];


  @Field(() => [CreateAudioResourceInput], { nullable: true })
  audios?: CreateAudioResourceInput[];

  @Field(() => [CreateSentenceResourceInput], { nullable: true })
  sentences?: CreateSentenceResourceInput[];

}

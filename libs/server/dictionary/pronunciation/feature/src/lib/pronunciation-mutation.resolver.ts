import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { PronunciationService } from '@els/server/dictionary/pronunciation/data-access/services';
import { CreatePronunciationInput, PronunciationMutations } from '@els/server/dictionary/pronunciation/data-access/types';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => PronunciationMutations )
export class PronunciationMutationsResolver {
  constructor(
    private readonly _pronunciationService: PronunciationService
  ) {};


  @ResolveField(() => Pronunciation)
  createPronunciation(
  @Args('createPronunciationInput') createPronunciationInput: CreatePronunciationInput
  ) {
    return this._pronunciationService.createPronunciation(createPronunciationInput);
  };
};

import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { PronunciationService } from '@els/server/dictionary/pronunciation/data-access/services';
import { PronunciationMutations } from '@els/server/dictionary/pronunciation/data-access/types';
import {
  Mutation, Resolver
} from '@nestjs/graphql';
  
@Resolver(() => Pronunciation)
export class PronunciationResolver {
  constructor(
    private readonly _pronunciationService: PronunciationService
  ) {};

  @Mutation(() => PronunciationMutations, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'pronunciation',
  })
  pronunciationsMutations() {
    return {};
  };

  // @Query(() => [Pronunciation], {name: 'pronunciations'})
  // pronunciations() {
  //   return this._pronunciationService.getPhonetic('younger brother', 'en', 'noun');
  // }
};
  
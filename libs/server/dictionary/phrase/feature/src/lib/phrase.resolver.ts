import { PhraseTranslation } from '@els/server/dictionary/phrase-translation/data-access/entities';
import { PhraseTranslationService } from '@els/server/dictionary/phrase-translation/data-access/services';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { PhraseService } from '@els/server/dictionary/phrase/data-access/services';
import { PhraseMutations } from '@els/server/dictionary/phrase/data-access/type';
import {
  Mutation, Parent, Query, ResolveField, Resolver, ResolveReference
} from '@nestjs/graphql';
  
@Resolver(() => Phrase)
export class PhraseResolver {
  constructor(
    private readonly _phraseService: PhraseService,
    private readonly _phraseTranslationService: PhraseTranslationService,
  ) {};

  @Mutation(() => PhraseMutations, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'phrase',
  })
  phraseMutations() {
    return {};
  };

  @ResolveField(() => [PhraseTranslation], { name: 'phraseTranslations' })
  phraseTranslations(@Parent() phrase: Phrase) {
    return this._phraseTranslationService.findById(phrase);
  };

  @Query(() => [Phrase])
  phrases(){
    return this._phraseService.getPhrase();
  };

  @ResolveReference()
  resolverReference(ref: { __typename: string, id: string }) {
    return this._phraseService.findPhraseFederation(ref.id);
  };
};
  
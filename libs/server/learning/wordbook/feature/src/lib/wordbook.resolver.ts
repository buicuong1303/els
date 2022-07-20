import { Vocabulary } from '@els/server/learning/common';
import { Wordbook } from '@els/server/learning/wordbook/data-access/entities';
import { WordbookService } from '@els/server/learning/wordbook/data-access/services';
import { WordbookMutations } from '@els/server/learning/wordbook/data-access/types';
import { Mutation, Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';

@Resolver(() => Wordbook)
export class WorkbookResolver {
  constructor(private readonly _wordbookService: WordbookService) {}

  @Mutation(() => WordbookMutations, { nullable: true, name: 'wordbook' })
  workbookMutations() {
    return {};
  }

  @Query(() => [Vocabulary], {name: 'vocabulariesWorkbook'})
  async getVocabulariesWordbook(@Args('wordbookId') wordbookId: string) {
    return this._wordbookService.getVocabulariesWordbook(wordbookId);
  }

  @ResolveField(() => [Vocabulary], { nullable: true })
  vocabularies(@Parent() wordbook: Wordbook) {
    return this._wordbookService.getVocabulariesWordbook(wordbook.id);
  }

}

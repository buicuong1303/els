import { Wordbook } from '@els/server/learning/wordbook/data-access/entities';
import { WordbookService } from '@els/server/learning/wordbook/data-access/services';
import { AddWordInput, CreateWordBookInput, WordbookMutations } from '@els/server/learning/wordbook/data-access/types';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => WordbookMutations )
export class WordbookMutationsResolver {
  constructor(private readonly _wordbookService: WordbookService) {}

  @ResolveField(() => Wordbook)
  create(
  @Args('createWordbookInput') createWordbookInput: CreateWordBookInput
  ) {
    return this._wordbookService.createWordbook(createWordbookInput);
  }

  @ResolveField(() => Wordbook)
  addWord(  @Args('addWordInput') addWordInput: AddWordInput) {
    return this._wordbookService.addWordToWordbook(addWordInput);
  }

  @ResolveField(() => Wordbook)
  removeWord(  @Args('addWordInput') removeWordInput: AddWordInput) {
    return this._wordbookService.removeWordToWordbook(removeWordInput);
  }
}

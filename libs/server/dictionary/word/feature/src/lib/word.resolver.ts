import { Contain } from '@els/server/dictionary/contain/data-access/entities';
import { Lang } from '@els/server/dictionary/lang/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { WordService } from '@els/server/dictionary/word/data-access/services';
import { FindWordArgs, GetWordArgs, PaginatedWord, WordMutations } from '@els/server/dictionary/word/data-access/types';
import { RedisCacheService } from '@els/server/shared';
import {
  Args, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference
} from '@nestjs/graphql';

@Resolver(() => Word)
export class WordResolver {
  constructor(
    private readonly _wordService: WordService,
    private readonly _redisCacheService: RedisCacheService,
  ) {}

  @Mutation(() => WordMutations, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'word',
  })
  wordMutations() {
    return {};
  };

  @Query(() => PaginatedWord)
  words(@Args() getWordArgs: GetWordArgs): Promise<PaginatedWord> {
    return this._wordService.getWords(getWordArgs);
  };

  @Query(() => Word, { name: 'word', nullable: true })
  async getWord(@Args() findWordArgs: FindWordArgs) {
    return await this._wordService.findOne(findWordArgs);
  };

  @ResolveField(() => [Meaning], { name: 'meanings' })
  meanings(@Parent() word: Word) {
    return this._wordService.findMeaningByWordId(word.id);
  };

  @ResolveField(() => [Contain], { name: 'contains' })
  contains(@Parent() word: Word) {
    return this._wordService.findContainByWordId(word.id);
  };

  @ResolveField(() => Lang, { name: 'lang' })
  lang(@Parent() word: Word) {
    return this._wordService.findLangByWordId(word.id);
  };

  @ResolveReference()
  async resolverReference(ref: { __typename: string, id: string}) {
    const data: any = await this._redisCacheService.get(`data-caching:wordsRef_${ref.id}`);
    if(data){
      return JSON.parse(data);
    }
    const word = await this._wordService.findWordFederation(ref.id);
    await this._redisCacheService.set(`data-caching:wordsRef_${ref.id}`, JSON.stringify(word), 60);
    return word;
  };
};

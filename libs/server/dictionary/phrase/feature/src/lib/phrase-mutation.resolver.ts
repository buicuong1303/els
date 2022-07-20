import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { CreatePhraseInput, PhraseMutations, TranslatePhrase } from '@els/server/dictionary/phrase/data-access/type';
import { PhraseService } from '@els/server/dictionary/phrase/data-access/services';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { GraphQLUpload } from 'graphql-upload';

@Resolver(() => PhraseMutations )
export class PhraseMutationsResolver {
  constructor(
    private readonly _phraseService: PhraseService
  ) {};


  @ResolveField(() => Phrase)
  create(
  @Args('createPhraseInput') createPhraseInput: CreatePhraseInput
  ) {
    return this._phraseService.createPhrase(createPhraseInput);
  };

  @ResolveField(() => Phrase)
  translatePhrase(
  @Args('translatePhrase') translatePhrase: TranslatePhrase
  ) {
    return this._phraseService.translatePhrase(translatePhrase);
  };

  @ResolveField(() => Phrase, { nullable: true })
  async importPhraseApi(@Args({ name: 'file', type: () => GraphQLUpload })
    file : any,
  ) {
    const result = await this._phraseService.importFilePhrase(file.file.buffer.data);
    return result;
  }

};

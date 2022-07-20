import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { WordImportService, WordService } from '@els/server/dictionary/word/data-access/services';
import { AddPhraseInput, CreateWordInput, SetWordPosInput, WordMutations } from '@els/server/dictionary/word/data-access/types';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';


@Resolver(() => WordMutations )
export class WordMutationsResolver {
  constructor(
    private readonly _wordService: WordService,
    private readonly _wordImportService: WordImportService
  ) {}


  @ResolveField(() => Word)
  create(
  @Args('createWordInput') createWordInput: CreateWordInput
  ) {
    return this._wordService.createWord(createWordInput);
  }

  @ResolveField(() => Meaning)
  setMeaning(
  @Args('setWordPosInput') setWordPosInput: SetWordPosInput
  ) {
    return this._wordService.setWordPos(setWordPosInput);
  }

  @ResolveField(() => Word)
  addPhrase(@Args('addPhraseInput') addPhraseInput: AddPhraseInput) {
    return this._wordService.addPhrase(addPhraseInput);
  }

  @ResolveField(() => Word)
  async importWordVn(
  @Args({ name: 'file', type: () => GraphQLUpload })
    file : any,
  ) {
    console.log('Import file VN');
    const fileValidated = await this._wordImportService.validateFile(file.file.buffer.data);
    console.log('Validate completed');
    const word = await this._wordImportService.importWordFromExcel(fileValidated);
    return word;
  }

  @ResolveField(() => Word, { nullable: true })
  async connectWordApi(@Args({ name: 'file', type: () => GraphQLUpload })
    file : any,
  ) {
    const result = await this._wordImportService.createWordsByApi(file.file.buffer.data);
    return result;
  }

  @ResolveField(() => [Definition], { nullable: true })
  async exportFormSample(@Args({ name: 'file', type: () => GraphQLUpload })
    file : any,
  ) {
    const result = await this._wordImportService.exportFormSample(file.file.buffer.data);
    return result;
  }
}

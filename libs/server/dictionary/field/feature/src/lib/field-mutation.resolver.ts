import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { WordService } from '@els/server/dictionary/word/data-access/services';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { AddWordToFieldInput, CreateFieldInput, FieldTbMutations } from '@els/server/dictionary/field/data-access/types';
import { FieldTbService } from '@els/server/dictionary/field/data-access/services';
import { FieldTb } from '@els/server/dictionary/field/data-access/entities';

@Resolver(() => FieldTbMutations )
export class FieldTbMutationsResolver {
  constructor(
    private readonly _fieldTbService: FieldTbService
  ) {}


  @ResolveField(() => FieldTb)
  create(
    @Args('createFieldInput') createFieldInput: CreateFieldInput
  ) {
    return this._fieldTbService.createFieldTb(createFieldInput);
  }

  @ResolveField(() => FieldTb)
  addWordToField(
    @Args('addWordToFieldInput') addWordToFieldInput: AddWordToFieldInput
  ) {
    return this._fieldTbService.addWordToField(addWordToFieldInput);
  }

//   @ResolveField(() => Meaning)
//   setMeaning(
//     @Args('setWordPosInput') setWordPosInput: SetWordPosInput
//   ) {
//     return this._wordService.setWordPos(setWordPosInput);
//   }

//   @ResolveField(() => DeleteMany)
//   deleteMany(
//     @Args('deleteTopicsInput') deleteTopicsInput: DeleteTopicsInput
//   ) {
//     return this._topicService.deleteTopicsByIds(deleteTopicsInput.ids);
//   }

//   @ResolveField(() => DeleteMany)
//   restoreMany(
//     @Args('restoreTopicsInput') restoreTopicsInput: DeleteTopicsInput
//   ) {
//     return this._topicService.restoreTopicsByIds(restoreTopicsInput.ids);
//   }
}

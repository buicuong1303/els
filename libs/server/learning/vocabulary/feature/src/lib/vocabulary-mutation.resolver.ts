import { ResolveField, Resolver, Args } from '@nestjs/graphql';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import {
  VocabularyMutations,
  CreateVocabularyInput,
  DeleteVocabulariesInput,
  GenerateResourceInput,
} from '@els/server/learning/vocabulary/data-access/types';
import { VocabularyService } from '@els/server/learning/vocabulary/data-access/services';
import { DeleteMany } from '@els/server/shared';

@Resolver(() => VocabularyMutations)
export class VocabularyMutationResolver {
  constructor(private readonly _vocabularyService: VocabularyService) {}
  @ResolveField(() => Vocabulary)
  create(
  @Args('createVocabularyInput') createVocabularyInput: CreateVocabularyInput
  ) {
    return this._vocabularyService.createVocabulary(createVocabularyInput);
  }

  @ResolveField(() => DeleteMany)
  deleteMany(
  @Args('deleteVocabulariesInput')
    deleteVocabulariesInput: DeleteVocabulariesInput
  ) {
    return this._vocabularyService.deleteVocabulariesByIds(
      deleteVocabulariesInput.ids
    );
  }

  @ResolveField(() => String)
  generateResource(
  @Args('generateResourceInput') generateResourceInput: GenerateResourceInput
  ) {
    if (generateResourceInput.topicId)
      return this._vocabularyService.generateResource(generateResourceInput);
    return this._vocabularyService.generateResourceForAllTopic(
      generateResourceInput
    );
  }

  @ResolveField(() => String)
  linkWords(@Args('topicId') topicId: string) {
    return this._vocabularyService.linkWords(topicId);
  }
}

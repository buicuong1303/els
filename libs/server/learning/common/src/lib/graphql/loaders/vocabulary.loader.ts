/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { VocabularyService } from '@els/server/learning/vocabulary/data-access/services';
import * as DataLoader from 'dataloader';

export const createVocabulariesLoader = (vocabularyService: VocabularyService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct vocabularies
    const vocabularies: Vocabulary[] = await vocabularyService.getVocabulariesByIds([...ids]);
    const vocabulariesMap = new Map(vocabularies.map(vocabulary => [vocabulary.id, vocabulary]));
    return ids.map((id) => vocabulariesMap.get(id));
  });
};

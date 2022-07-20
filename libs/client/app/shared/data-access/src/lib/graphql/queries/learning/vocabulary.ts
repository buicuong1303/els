import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetVocabularies = gql`
  ${LearningFragments.Vocabulary.VocabulariesDetailsRelations}
  query Vocabularies(
    $getVocabulariesInput: GetVocabulariesInput!,
  ) {
    vocabularies(getVocabulariesInput: $getVocabulariesInput) {
      ...VocabulariesDetailsRelations
    }
  }
`;
// {
//   "getVocabulariesInput": {
//     "vocabularyIds": ["ac7dc64d-a90c-45c9-894d-3294665fd59a", "a8b3f4ef-3214-49b5-94e4-9fba0809bdf4"],
//   }
// }

export const GetVocabulariesIncludeWordRefer = gql`
  ${LearningFragments.Vocabulary.VocabulariesDetailsIncludeWordReferRelations}
  query Vocabularies(
    $getVocabulariesInput: GetVocabulariesInput!,
    $target: String!,
    $translatesTarget: String!,
    $source: String!,
  ) {
    vocabularies(getVocabulariesInput: $getVocabulariesInput) {
      ...VocabulariesDetailsIncludeWordReferRelations
    }
  }
`;
// {
//   "vocabularyIds": ["ac7dc64d-a90c-45c9-894d-3294665fd59a", "a8b3f4ef-3214-49b5-94e4-9fba0809bdf4"],
//   "target": "en",
//   "translatesTarget": "en",
//   "source": "en",
// }
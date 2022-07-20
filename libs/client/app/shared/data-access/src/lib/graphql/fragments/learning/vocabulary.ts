import { gql } from '@apollo/client';
import { PhraseRelations, WordRelations } from './word';
export const VocabulariesShortRelations = gql`
  fragment VocabulariesShortRelations on Vocabulary {
    id
  }
`;

export const VocabulariesDetailsRelations = gql`
  fragment VocabulariesDetailsRelations on Vocabulary {
    id
    vocabulary
    translation
    type
    referenceId
    pos
    phonetic
    audio
    image
    memoryLevel
    lesson {
      id
      name
    }
    topic {
      id
      name
    }
  }
`;

export const VocabulariesDetailsIncludeWordReferRelations = gql`
  ${WordRelations}
  ${PhraseRelations}
  fragment VocabulariesDetailsIncludeWordReferRelations on Vocabulary {
    id
    vocabulary
    translation
    type
    referenceId
    pos
    phonetic
    audio
    image
    memoryLevel
    lesson {
      id
      name
    }
    topic {
      id
      name
    }
    reference {
      __typename
      ... on Word {
        ...WordRelations
      }
      __typename
      ... on Phrase {
        ...PhraseRelations
      }
    }
  }
`;
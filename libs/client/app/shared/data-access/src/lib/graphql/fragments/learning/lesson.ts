import { gql } from '@apollo/client';

export const LessonsShortRelations = gql`
  fragment LessonsShortRelations on Lesson {
    id
  }
`;

export const LessonsDetailsRelations = gql`
  fragment LessonsDetailsRelations on Lesson {
    id
    name
    vocabularies {
      # ...VocabulariesDetailsRelations
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
      topic {
        id
      }
    }
  }
`;
import { gql } from '@apollo/client';
import { VocabulariesDetailsRelations } from './vocabulary';

export const QuestionsRelations = gql`
  ${VocabulariesDetailsRelations},
  fragment QuestionsRelations on Question {
    id,
    choices,
    correctAnswer,
    type,
    action,
    skills,
    sourceLang,
    targetLang,
    prompt {
      text,
      audio,
      video,
      image
    },
    vocabulary {
      ...VocabulariesDetailsRelations
    }
  }
`;
import { gql } from '@apollo/client';

export const LearnVocabulary = gql`
  mutation LearnVocabulary($learnVocabularyInput: LearnVocabularyInput!) {
    enrollment {
      learnVocabulary(learnVocabularyInput: $learnVocabularyInput) {
        id
        memoryStatus
        vocabulary {
          id
        }
        student {
          id
        }
      }
    }
  }
`;
// "learnVocabularyInput": {
//   "lessonId": "424e9fe5-618a-4a16-923d-6a6b2e16db4c",
//   "vocabularyId": "ac7dc64d-a90c-45c9-894d-3294665fd59a",
//   "skills": ["read", "listen", "speak", "write"],
// }
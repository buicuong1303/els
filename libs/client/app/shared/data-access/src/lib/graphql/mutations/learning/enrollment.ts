import { gql } from '@apollo/client';

export const JoinTopic = gql`
  mutation Create($createEnrollmentInput: CreateEnrollmentInput!) {
    enrollment {
      create(createEnrollmentInput: $createEnrollmentInput) {
        id
      }
    }
  }
`;
// {
//   "createEnrollmentInput": {
//     "topicId": "",
//   }
// }

export const MarkMemorizedVocabulary = gql`
  mutation UnTrackVocabulary($unTrackVocabularyInput: UnTrackVocabularyInput!, $isNewVocabulary: Boolean = false) {
    enrollment {
      unTrackVocabulary(unTrackVocabularyInput: $unTrackVocabularyInput) {
        id
        vocabulary {
          id
          vocabulary
        }
        memoryStatus
        student {
          id
          summaryMemoryStatus @include(if: $isNewVocabulary) {
            newVocabularies
            memorizedVocabularies 
            vagueVocabularies 
            forgotVocabularies
          }
          memoryAnalyses @include(if: $isNewVocabulary) {
            id
            memoryStatus
            vocabulary {
              id
            }
            student {
              id
            }
          }
          user {
            id
            ignoredWords
            summaryMemoryStatus @include(if: $isNewVocabulary) {
              newVocabularies
              memorizedVocabularies 
              vagueVocabularies 
              forgotVocabularies 
            }
            memoryAnalyses @include(if: $isNewVocabulary) {
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
      }
    }
  }
`;
// {
//   "unTrackVocabularyInput": {
//     "lessonId": null,
//     "studentId": null,
//     "unTrackingMode": null,
//     "vocabularyId": null
//   }
// }

export const UnmarkMemorizedVocabulary = gql`
  mutation UnTrackVocabulary($memoryAnalysisId: String!) {
    enrollment {
      trackVocabulary(memoryAnalysisId: $memoryAnalysisId) {
        id
        vocabulary {
          id
          vocabulary
        }
        memoryStatus
        #student {
        #  id
        #  user {
        #    id
        #    ignoredWords
        #  }
        #}
      }
    }
  }
`;
// {
//   "memoryAnalysisId": null
// }

export const UpdateMemoryAnalysis = gql`
  mutation UpdateMemoryAnalysis($updateMemoryAnalysisInput: UpdateMemoryAnalysisInput!) {
    enrollment {
      updateMemoryAnalysis(updateMemoryAnalysisInput: $updateMemoryAnalysisInput) {
        id
      }
    }
  }
`;
// {
//   "updateMemoryAnalysisInput": {
//     "questionId": null,
//     "answer": '',
//   }
// }
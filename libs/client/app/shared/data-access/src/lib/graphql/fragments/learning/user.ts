import { gql } from '@apollo/client';

export const UserRelation = gql`
  fragment UserRelation on User {
    id
    createdAt
    identity {
      id
      traits {
        firstName
        lastName
        middleName
        email
        picture
        username
        phone
        inviter
      }
    }
  }
`;

export const UserFullInformationRelation = gql`
  ${UserRelation}
  fragment UserFullInformationRelation on User {
    ...UserRelation
    expDate
    extraInfo
    level
    exp
    nextLevelExp
    memoryFluctuations
    ignoredWords
    summaryMemoryStatus {
      newVocabularies 
      forgotVocabularies 
      vagueVocabularies 
      memorizedVocabularies
    }
    memoryAnalyses {
      id
      memoryStatus
      vocabulary {
        id
      }
      student {
        id
      }
    }
    enrollments {
      id
      createdAt
      lastActivityAt
      isCompleted
      topic {
        id
        name
        thumbnailUri
        vocabularies {
          id
        }
        specialization {
          id
          name
          category {
            id
            name
          }
        }
      }
      summaryMemoryStatus {
        newVocabularies 
        forgotVocabularies 
        vagueVocabularies
        memorizedVocabularies 
      }
      memoryAnalyses {
          id
          memoryStatus
          vocabulary {
             id
          }
      }
      # memoryAnalyses {
      #   id
      #   isFirstTime
      #   memoryStatus
      #   # unTrackingMode
      #   vocabulary {
      #     id
      #   }
      #   student {
      #     id
      #   }
      #   actualSkills {
      #     id
      #     percent
      #     currentLevel
      #     skill {
      #       id
      #       name
      #     }
      #     skillLevel {
      #       id
      #       alpha
      #     }
      #   }
      # }
    }
    streakLists {
      id
      status
      streaks {
        expDate
        expTarget
        createdAt
        id
      }
    }
    identity {
      verifiableAddresses {
        id
        value
        verified
        via
        status
      }
    }
    setting
  }
`;
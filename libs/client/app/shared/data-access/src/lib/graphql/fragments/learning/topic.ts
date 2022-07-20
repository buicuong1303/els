import { gql } from '@apollo/client';
import { LessonsDetailsRelations, LessonsShortRelations } from './lesson';
import { VocabulariesShortRelations, VocabulariesDetailsRelations } from './vocabulary';
import { CategoryInfo } from './specialization';
export const VocabulariesInfo = gql`
  fragment VocabulariesInfo on Topic {
    vocabularies {
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
    }
  }
`;
export const TopicShortRelations = gql`
  fragment TopicShortRelations on Topic {
    id
    name
    description
    thumbnailUri
    numberOfParticipants
    rating
    specialization {
      id
      name
      description
      category {
        id
        name
        description
      }
    }
  }
`;

export const TopicRelations = gql`
  ${VocabulariesShortRelations}
  ${VocabulariesDetailsRelations}
  ${LessonsShortRelations}
  ${LessonsDetailsRelations}
  fragment TopicRelations on Topic {
    id
    name
    description
    thumbnailUri
    numberOfParticipants
    rating
    specialization {
      id
      name
      description
      category {
        id
        name
        description
      }
    }
    fromLang {
      id
      name
      code
    }
    learningLang {
      id
      name
      code
    }
    lessons {
      ...LessonsShortRelations
      ...LessonsDetailsRelations @include(if: $includeLessonInfo)
    }
    vocabularies {
      ...VocabulariesShortRelations
      ...VocabulariesDetailsRelations @include(if: $includeVocabularyInfo)
    }
  }
`;

export const MyTopicShortRelations = gql`
  fragment MyTopicShortRelations on Topic {
    id
    name
    description
    thumbnailUri
    numberOfParticipants
    rating
    specialization {
      id
      name
      description
      category {
        id
        name
        description
      }
    }
  }
`;

export const MyTopicRelations = gql`
  ${VocabulariesInfo}
  ${LessonsShortRelations}
  ${LessonsDetailsRelations}
  ${CategoryInfo}

  fragment MyTopicRelations on Topic {
    id
    name
    # description
    thumbnailUri
    # numberOfParticipants
    # rating
    specialization {
      id
      name
      description
      ...CategoryInfo @include(if: $includeCategoryInfo)
    }
    # fromLang {
    #   id
    #   name
    #   code
    # }
    # learningLang {
    #   id
    #   name
    #   code
    # }
    lessons {
      ...LessonsShortRelations
      ...LessonsDetailsRelations @include(if: $includeLessonInfo)
    }
    ...VocabulariesInfo @include(if: $includeVocabularyInfo)

    students {
      id
      # summarySkill
      # memoryFluctuations
      # memoryAnalyses {
      #   id
      #   isFirstTime
      #   memoryStatus
      #   unTrackingMode
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
      memoryAnalyses {
          id
          memoryStatus
          vocabulary {
             id
          }
      }
      summaryMemoryStatus {
        newVocabularies
        memorizedVocabularies
        vagueVocabularies
        forgotVocabularies
      }
      user {
        ignoredWords
      }
      # user {
      #   ignoredWords
      # }
    }
  }
`;

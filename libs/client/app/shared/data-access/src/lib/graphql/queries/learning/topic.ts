import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetTopicsShort = gql`
  ${LearningFragments.Topic.TopicShortRelations}
  query Topics(
    $ids: [String],
    $pageNumber: Int,
    $limit: Int,
    $category: String,
    $name: String,
    $specs: [String!],
  ) {
    topics(pageNumber: $pageNumber, limit: $limit, category: $category, name: $name, specs: $specs, ids: $ids) {
      nodes {
        ...TopicShortRelations
      }
      pageInfo {
        total
      }
    }
  }
`;

export const GetTopicShortFromCache = gql`
  ${LearningFragments.Topic.TopicShortRelations}
  query Topics {
    topics {
      ...TopicShortRelations
    }
  }
`;

export const GetTopics = gql`
  ${LearningFragments.Topic.TopicRelations}
  query Topics(
    $ids: [String],
    $pageNumber: Int,
    $limit: Int,
    $category: String,
    $name: String,
    $specs: [String!],
    $includeVocabularyInfo: Boolean = false,
    $includeLessonInfo: Boolean = false
  ) {
    topics(pageNumber: $pageNumber, limit: $limit, category: $category, name: $name, specs: $specs, ids: $ids) {
      nodes {
        ...TopicRelations
      }
      pageInfo {
        total
      }
    }
  }
`;

export const GetTopicFromCache = gql`
  ${LearningFragments.Topic.TopicRelations}
  query Topics ($includeVocabularyInfo: Boolean = false, $includeLessonInfo: Boolean = false) {
    topics {
      ...TopicRelations
    }
  }
`;

export const GetMyTopicsShort = gql`
  ${LearningFragments.Topic.MyTopicShortRelations}
  query MyTopics {
    myTopics {
      ...MyTopicShortRelations
    }
  }
`;

// export const GetMyTopics = gql`
//   ${LearningFragments.Topic.MyTopicRelations}
//   query MyTopics($includeVocabularyInfo: Boolean = false, $includeLessonInfo: Boolean = false, $includeCategoryInfo: Boolean = false ) {
//     myTopics {
//       ...MyTopicRelations
//     }
//   }
// `;

export const GetMyTopics = gql`
  query MyTopics {
    myTopics {
      id
      name
      thumbnailUri
      specialization {
        id
        name
        description
      }
      lessons {
        id,
      }
      students {
        id,
        summaryMemoryStatus {
          newVocabularies
          memorizedVocabularies
          vagueVocabularies
          forgotVocabularies
        }
        memoryAnalyses {
          id
          memoryStatus
          vocabulary {
          id
          }
        }
        user {
          ignoredWords
        }
      }
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
  }
`;

export const GetMyTopicDetails = gql`
  ${LearningFragments.Topic.MyTopicRelations}
  query MyTopicDetails($studentIds: [String], $includeVocabularyInfo: Boolean = false, $includeLessonInfo: Boolean = false,  $includeCategoryInfo: Boolean = false) {
    myTopicDetails(studentIds: $studentIds) {
      ...MyTopicRelations
    }
  }
`;

export const GetActualSkillHistory = gql`
  query Topic($period: String!, $skill: String!, $studentId: String!) {
    topic {
      getActualSkillHistory(period: $period, skill: $skill, studentId: $studentId)
    }
  }
`;

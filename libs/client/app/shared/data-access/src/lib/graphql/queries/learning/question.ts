import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetQuestions = gql`
  ${LearningFragments.Question.QuestionsRelations}
  query Questions($topicId: String, $equipments: [String!]!, $vocabularyIds: [String]) {
    questions(topicId: $topicId, equipments: $equipments, vocabularyIds: $vocabularyIds) {
      ...QuestionsRelations
    }
  }
`;
// {
//   "equipments": ["headphone", "microphone"],
//   "vocabularyIds": ["ac7dc64d-a90c-45c9-894d-3294665fd59a", "a8b3f4ef-3214-49b5-94e4-9fba0809bdf4"]
// }

export const GetQuickTest = gql`
  ${LearningFragments.Question.QuestionsRelations}
  query QuickTest($equipments: [String!]!, $numberOfQuestions: Int!, $topicIds: [String]) {
    quickTest(equipments: $equipments, numberOfQuestions: $numberOfQuestions, topicIds: $topicIds) {
      ...QuestionsRelations
    }
  }
`;
// {
//   "equipments": ["listen", "speak"],
//   "numberOfQuestions": 10,
//   "topicIds": ["0e488e3f-95c1-48d3-a7a6-ee8836e60321"]
// }
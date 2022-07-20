import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetLessons = gql`
  ${LearningFragments.Lesson.LessonsDetailsRelations}
  query Lessons($ids: [String]) {
    lessons(ids: $ids) {
      ...LessonsDetailsRelations
    }
  }
`;
// {
//   "ids": ["424e9fe5-618a-4a16-923d-6a6b2e16db4c"]
// }
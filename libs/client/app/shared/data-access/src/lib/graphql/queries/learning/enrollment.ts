import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';


export const GetEnrollment = gql`
  ${LearningFragments.Enrollment.EnrollmentRelations}
  query Enrollment($topicId: String!) {
    enrollment(topicId: $topicId) {
      ...EnrollmentRelations
    }
  }
`;
// {
//   "userId": "9bac4427-510f-4976-8bca-ecacc8bf6b54",
//   "topicId": "5500d1fe-46fc-43f7-8da6-92c5ae705a87",
// }
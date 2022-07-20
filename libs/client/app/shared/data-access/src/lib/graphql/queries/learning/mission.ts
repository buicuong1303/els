import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetAssignedMissions = gql`
  ${LearningFragments.Mission.AssignedMissionRelations}
  query AssignedMissions ($category: String!) {
    assignedMissions (category: $category) {
      ...AssignedMissionRelations
    }
  }
`;
// {
//   "category": "daily", //? 'daily'| 'weekly' | 'completed' | 'none-repeatable'
// }
import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const DoneAssignedMission = gql`
  ${LearningFragments.Mission.AssignedMissionRelations}
  mutation DoneAssignedMission($doneAssignedMissionInput: DoneAssignedMissionInput!) {
    assignedMission {
      doneAssignedMission(doneAssignedMissionInput: $doneAssignedMissionInput) {
        ...AssignedMissionRelations
      }
    }
  }
`;
// "doneAssignedMissionInput": {
//   "assignedMissionId": ""
// },
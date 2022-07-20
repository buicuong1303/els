import { gql } from '@apollo/client';

export const AssignedMissionRelations = gql`
  fragment AssignedMissionRelations on AssignedMission {
    id
    createdAt
    expiredAt
    completedAt
    status
    currentProgress
    mission {
      id
      code
      title
      titleEn
      maxProgress
      reward {
        id
        value
        rewardUnit {
          id
          code
        }
      }
    }
    missionTarget {
      id
      maxProgress 
    }
  }
`;
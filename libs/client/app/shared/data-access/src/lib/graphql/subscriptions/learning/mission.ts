import { gql } from '@apollo/client';

export const SubscriptionMissionCompleted = gql`
  subscription {
    missionCompleted {
      id
      assignedAt
      expiredAt
      completedAt
      status
      currentProgress
      maxProgress
      missionId
      userId
    }
  }
`;
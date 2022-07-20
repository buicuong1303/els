import { gql } from '@apollo/client';

export const SubscriptionStreakCreated = gql`
  subscription {
    streakCreated {
      triggerString
    }
  }
`;
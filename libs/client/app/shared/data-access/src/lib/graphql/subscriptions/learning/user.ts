import { gql } from '@apollo/client';

export const SubscriptionExpUp = gql`
  subscription {
    expUp {
      idSubscription
      identityId
      exp
      expDate
      level
      nextLevelExp
    }
  }
`;
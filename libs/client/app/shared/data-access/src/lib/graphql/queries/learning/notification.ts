import { gql } from '@apollo/client';

export const GetNotifications = gql`
  query Notifications {
    notifications {
      id
      actor
      code
      message
      link
      status
      createdAt
    }
  }
`;
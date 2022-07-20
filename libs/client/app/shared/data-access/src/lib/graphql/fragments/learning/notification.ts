import { gql } from '@apollo/client';

export const AddNotificationFragmentCache = gql`
  fragment NewNotificationData on NotificationData {
    id
    actor
    code
    message
    link
    status
    createdAt
  }
`;
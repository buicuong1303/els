import { gql } from '@apollo/client';

export const ReadNotifications = gql`
  mutation Read($readNotificationInput: ReadNotificationInput!) {
    notification {
      read(readNotificationInput: $readNotificationInput)
    }
  }
`;
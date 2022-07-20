import { gql } from '@apollo/client';

export const LinkSocialNetwork = gql`
     query Account {
        account {
          linkSocialNetwork
        }
    }
`;

export const Logout = gql`
     query Account {
        account {
          logout
        }
    }
`;

export const GetUserSetting = gql`
  query Setting($userId: String!) {
    setting(userId: $userId) {
      id
      createdAt
      #createdBy
      language
      langStudy
      exp
      listen
      speak
      sound
      notification
      user {
        id
      }
    }
  }
`;
// {
//   "userId": null
// }
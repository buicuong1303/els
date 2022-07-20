import { gql } from '@apollo/client';
export const CreateUser = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    user {
      create(createUserInput: $createUserInput) {
        id
      }
    }
  }
`;


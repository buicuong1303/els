import { gql } from '@apollo/client';

export const CreateTopic = gql`
  mutation Create($createTopicInput: CreateTopicInput!) {
    topic {
      create(createTopicInput: $createTopicInput) {
        id
        description
        name
        thumbnailUri
      }
    }
  }
`;
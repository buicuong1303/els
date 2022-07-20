import { gql } from '@apollo/client';
import { UserRelation } from './user';

export const CommentsRelations = gql`
  ${UserRelation}
  fragment CommentsRelations on Comment {
    _id
    createdAt
    parentId
    text
    children
    category
    rating
    reactionCount
    reactions {
      _id
      emoji
      user {
        ...UserRelation
      }
    }
    user {
      ...UserRelation
    }
  }
`;
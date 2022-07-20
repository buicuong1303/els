import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetComments = gql`
  ${LearningFragments.Comment.CommentsRelations}
  query Comments($entityId: String!, $entityName: String!) {
    comments(entityId: $entityId, entityName: $entityName) {
      ...CommentsRelations
    }
  }
`;
// {
//   "entityId": "e579c227-c73e-403a-839e-2283355d41c3",
//   "entityName": "topic",
// }

export const GetEvaluations = gql`
  ${LearningFragments.Comment.CommentsRelations}
  query Evaluations($entityId: String!, $entityName: String!) {
    evaluations(entityId: $entityId, entityName: $entityName) {
      ...CommentsRelations
    }
  }
`;
// {
//   "entityId": "e579c227-c73e-403a-839e-2283355d41c3",
//   "entityName": "topic",
// }
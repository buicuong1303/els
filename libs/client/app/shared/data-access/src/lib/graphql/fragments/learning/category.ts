import { gql } from '@apollo/client';

export const CategoriesRelations = gql`
  fragment CategoriesRelations on Category {
    id
    name
    description
    specializations {
      id
      name
      description
    }
  }
`;

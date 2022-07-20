import { gql } from '@apollo/client';

export const SpecializationRelations = gql`
  fragment SpecializationRelations on Category {
    id
      name
      description
      category {
        id
        name
        description
    }
  }
`;
export const CategoryInfo = gql`
  fragment CategoryInfo on Specialization {
    category {
      id
      name
      description
    }
  }
`;

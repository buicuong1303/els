import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetCategories = gql`
  ${LearningFragments.Category.CategoriesRelations}
  query Categories {
    categories {
      ...CategoriesRelations
    }
  }
`;

export const GetCategoryDetail = gql`
  query CategoryDetails($categoryId: String!, $userId: String) {
    categoryDetails(categoryId: $categoryId, userId: $userId) {
      name
      id
      description
      specializations {
        id
        name
        vocabularyMemorized
        totalVocabulary
      }
    }
  }
`;
// {
//   "categoryId": "de7ed980-c220-4360-9d41-fae599f92ab2"
// }
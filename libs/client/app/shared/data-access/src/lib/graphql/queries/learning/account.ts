import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetCurrentAccount = gql`
  ${LearningFragments.Account.CurrentAccountRelations}
  query Account {
    account {
      current {
        ...CurrentAccountRelations
      }
    }
  }
`;
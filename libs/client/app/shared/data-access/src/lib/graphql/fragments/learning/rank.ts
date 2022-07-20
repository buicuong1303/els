import { gql } from '@apollo/client';
import { UserRelation } from './user';

export const RankTypesRelations = gql`
  fragment RankTypesRelations on RankType {
    id
    name
  }
`;

export const RanksRelations = gql`
  ${UserRelation}
  fragment RanksRelations on Rank {
    id
    number
    numberChange
    elo {
      exp
      level
      nextExp
      topic
      word
    }
    rankType {
      id
      name
    }
    user { 
      ...UserRelation
    }
  }
`;
import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetRankTypes = gql`
  ${LearningFragments.Rank.RankTypesRelations}
  query RankType {
    rankType {
      ...RankTypesRelations
    }
  }
`;

export const GetRanks = gql`
  ${LearningFragments.Rank.RanksRelations}
  query Ranks($name: String!, $limit: Int, $pageNumber: Int) {
    ranks(name: $name, limit: $limit, pageNumber: $pageNumber) {
      nodes {
        ...RanksRelations
      }
      pageInfo {
        total
      }
    }
  }
`;
// {
//   "name": 'word',
//   "limit": 10,
//   "pageNumber": 1,
// }

export const GetMyRank = gql`
  ${LearningFragments.Rank.RanksRelations}
  query Ranks($rankType: String!) {
    myRank(rankType: $rankType) {
      ...RanksRelations
    }
  }
`;
// {
//   rankType: 'Topic',
// }

export const GetRankUserInfo = gql`
  ${LearningFragments.User.UserRelation}
  query RankUserInfo($userId: String!) {
    rankUserInfo(userId: $userId) {
      attendance
      currentStreak
      fromLang
      learningLang
      rankInfo {
        exp
        level
        nextExp
        topic
        word
      }
      userInfo {
        ...UserRelation
      }
    }
  }
`;
// {
//   userId: '',
// }
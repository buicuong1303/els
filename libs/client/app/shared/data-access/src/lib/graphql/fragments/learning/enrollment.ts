import { gql } from '@apollo/client';

export const EnrollmentRelations = gql`
  fragment EnrollmentRelations on Enrollment {
    id
    topic {
      id
    }
    user {
      id
    }
    memoryAnalyses {
          id
          memoryStatus
          vocabulary {
             id
          }
      }
  }
`;
import { gql } from '@apollo/client';

export const CurrentAccountRelations = gql`
  fragment CurrentAccountRelations on AccountIdentity {
    id
    recoveryAddresses {
      id
      value
      via
    }
    authenticationMethods
    state
    verifiableAddresses {
      id
      status
      value
      verified
      via
    }
    traits {
      email
      firstName
      inviter
      middleName
      lastName
      phone
      picture
      username
    }
  }
`;
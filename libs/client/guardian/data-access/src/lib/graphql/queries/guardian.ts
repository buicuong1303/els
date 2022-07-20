import { gql } from '@apollo/client';

//* ------------------------------- ACCOUNT ------------------------------- //
export const GetCurrentUser = gql`
    query Account {
        account {
            current {
                id
                traits {
                    firstName
                    lastName
                    middleName
                    email
                    picture
                    username
                    phone
                    inviter
                }
                verifiableAddresses {
                  id
                  value
                  verified
                  via
                  status
                }
                state
                user {
                  id
                  identityId
                  ignoredWords
                  level
                  exp
                  nextLevelExp
                }
            }
        }
    }
`;

export const CheckAvailableAccount = gql`
    query Account($identity: String!) {
        account {
            available(identity: $identity)
        }
    }
`;
// {
//     "identity": ""
// }



//* ------------------------------- SESSION ------------------------------- //
import { gql } from '@apollo/client';

//* ------------------------------- ACCOUNT ------------------------------- //
export const CreateOrRegister = gql`
    mutation Account($createAccountInput: CreateAccountInput!) {
        account {
            create(createAccountInput: $createAccountInput) {
                idToken
            }
        }
    }
`;
// {
//     "createAccountInput": {
//         "firstName": "",
//         "middleName": "",
//         "lastName": "",
//         "email": "",
//         "username": "",
//         "password": "",
//         "confirmPassword": ""
//     }
// }

export const VerifyAccount = gql`
    mutation RequestVerify($email: String!) {
        account {
        requestVerify(email: $email)
        }
    }
`;
// {
//     "email": ""
// }

export const PreSignAvatarUrl = gql`
    mutation PreSignAvatarUrl($fileName: String!) {
        account {
            preSignAvatarUrl(fileName: $fileName)
        }
    }
`;
// "fileName": null

export const UpdateProfile = gql`
    mutation UpdateProfile($updateProfileInput: UpdateProfileInput!) {
        account {
            updateProfile(updateProfileInput: $updateProfileInput) {
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
                state
            }
        }
    }
`;
// {
//     "updateProfileInput": {
//          "username": "",
//          "email": "",
//          "phone": "",
//          "firstName": "",
//          "middleName": "",
//          "lastName": "",
//          "picture": "",
//          "userInvitedId": "",
//     }
// }
// set header: { Authorization: 'Bearer ${idToken}' }

// TODO backend in process
export const UpdatePassword = gql`
    mutation UpdatePassword($updatePasswordInput: UpdatePasswordInput!) {
        account {
            updatePassword(updatePasswordInput: $updatePasswordInput) {
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
                state
            }
        }
    }
`;
// {
//     "updatePasswordInput": {
//          "currentPassword": "",
//          "password": "",
//          "confirmPassword": ""
//     }
// }
// set header: { Authorization: 'Bearer ${idToken}' }

export const RequestRecovery = gql`
    mutation RequestRecovery($email: String!) {
        account {
            requestRecovery(email: $email)
        }
    }
`;
// {
//     "email": ""
// }

// TODO backend in process
export const ExpirePassword = gql`
    mutation ExpirePassword($accountId: String!) {
        account {
            expirePassword(accountId: $accountId)
        }
    }
`;
// {
//     "accountId": ""
// }

export const DeleteAccount = gql`
    mutation Account {
        account {
            delete
        }
    }
`;
// set header: { Authorization: 'Bearer ${idToken}' }



//* ------------------------------- SESSION ------------------------------- //
export const CheckCurrentPassword = gql`
   mutation CheckCurrentPassword($checkCurrentPasswordInput: CheckCurrentPasswordInput!) {
      account {
        checkCurrentPassword(checkCurrentPasswordInput: $checkCurrentPasswordInput) 
      }
}
`;
export const Login = gql`
    mutation Create($createSessionInput: CreateSessionInput!) {
        session {
            create(createSessionInput: $createSessionInput) {
                idToken
            }
        }
    }
`;
// {
//     "createSessionInput": {
//         "identity": "",
//         "password": ""
//     }
// }

export const Logout = gql`
    mutation Session {
        session {
            delete
        }
    }
`;
// set header: { Authorization: 'Bearer ${idToken}' }

// TODO backend in process
export const RefreshToken = gql`
    mutation Session {
        session {
            refresh
        }
    }
`;
// set header: { Authorization: 'Bearer ${idToken}' }
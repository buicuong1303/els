import { gql } from '@apollo/client';

export const AcceptInvitation = gql`
  mutation Accept($invitationAcceptInput: InvitationAcceptInput!) {
    invitation {
      accept(invitationAcceptInput: $invitationAcceptInput)
    }
  }
`;
// "invitationAcceptInput": {
//   "inviterId": ""
// },

export const CheckIn = gql`
  mutation User {
    user {
      checkIn
    }
  }
`;
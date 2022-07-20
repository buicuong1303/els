import { gql } from '@apollo/client';
import { LearningFragments } from '../../fragments';

export const GetUserSetting = gql`
  ${LearningFragments.User.UserRelation}
  query User($inviterId: String) {
    user(inviterId: $inviterId) {
      ...UserRelation
      setting
    }
  }
`; 

export const GetUser = gql`
  ${LearningFragments.User.UserFullInformationRelation}
  query User($inviterId: String) {
    user(inviterId: $inviterId) {
      ...UserFullInformationRelation
    }
  }
`;

export const GetUsersAcceptInvitation = gql`
  ${LearningFragments.User.UserRelation}
  query Query {
    usersAcceptInvitation {
      ...UserRelation
    }
  }
`;

export const GetInvitation = gql`
  query Invitation {
    invitation {
      getLink
      emailInviter {
        subject
        body
      }
    }
  }
`;

export const GetAttendanceUser = gql`
  query AttendanceUser {
    attendanceUser {
      id
      createdAt
      completedAt
    }
  }
`;
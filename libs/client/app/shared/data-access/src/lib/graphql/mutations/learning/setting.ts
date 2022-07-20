import { gql } from '@apollo/client';

export const UpdateSettingApp = gql`
  mutation UpdateApp($updateSettingAppInput: UpdateSettingAppInput!) {
    settings {
      updateApp(updateSettingAppInput: $updateSettingAppInput) {
        id
        exp
        fromLang
        learningLang
        listen
        notification
        sound
        speak
      }
    }
  }
`;
// "UpdateSettingAppInput": {
//   "learningLang": null,
//   "fromLang": null,
//   "sound": null,
//   "notification": null,
//   "listen": null,
//   "speak": null
// }

export const UpdateSettingTarget = gql`
  mutation UpdateTarget($updateSettingTarget: UpdateSettingTargetInput!) {
    settings {
      updateTarget(updateSettingTarget: $updateSettingTarget) {
        id
        exp
        fromLang
        learningLang
        listen
        notification
        sound
        speak
      }
    }
  }
`;
// {
//   "updateSettingTarget": {
//     "reviewForgot": null,
//     "reviewVague": null
//     "learnNew": null,
//     "exp": null,
//   }
// }

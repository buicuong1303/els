import { gql } from '@apollo/client';

export const CreateDevice = gql`
  mutation Device($createDeviceInput: CreateDeviceInput!) {
    device {
      create(createDeviceInput: $createDeviceInput) {
        token
      }
    }
  }
`;

export const UpdateDevice = gql`
  mutation Device($updateDeviceInput: UpdateDeviceInput!) {
    device {
      update(updateDeviceInput: $updateDeviceInput) {
        token
      }
    }
  }
`;

export const DeleteDevice = gql`
  mutation Device($deleteDeviceInput: DeleteDeviceInput!) {
    device {
      delete(deleteDeviceInput: $deleteDeviceInput)
    }
  }
`;

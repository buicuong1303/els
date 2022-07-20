/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { FC, useEffect } from 'react';
import { DialogConfirmValueType } from '../../setting';
import { SettingProfileForm  } from '@els/client/app/setting/ui';
import { LazyQueryResult, OperationVariables, QueryLazyOptions } from '@apollo/client';

const ProfileWrapper = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
  `
);

export interface ProfileProps {
  // currentUser: GraphqlTypes.LearningTypes.User;
  // updateProfile: (profileInfo: ProfileInfoType) => void;
  GetCurrentUser: (options?: QueryLazyOptions<OperationVariables> | undefined) => Promise<LazyQueryResult<{ user: GraphqlTypes.LearningTypes.User }, OperationVariables>>
  updateProfileLoading: boolean;
  uploadAvatarLoading: boolean;
  // preSignAvatarUrl?: string;
  // uploadAvatar: (avatarFile: any) => void;
  handleOpenDialogConfirm: (data: DialogConfirmValueType) => void;
  sx?: SxProps;
}

export const Profile: FC<ProfileProps> = (props) => {
  const { GetCurrentUser, updateProfileLoading, uploadAvatarLoading, handleOpenDialogConfirm, sx } = props;

  useEffect(() => {
    const avatarInput = document.getElementById('avatar_input') as HTMLInputElement;

    if (avatarInput) avatarInput.value = '';
  }, [uploadAvatarLoading]);

  // * render ui
  return (
    <ProfileWrapper maxWidth="950px" sx={sx}>
      <Box>
        <SettingProfileForm handleOpenDialogConfirm={handleOpenDialogConfirm} updateProfileLoading={updateProfileLoading} GetCurrentUser={GetCurrentUser} />
      </Box> 
    </ProfileWrapper>
  );
};

export default Profile;

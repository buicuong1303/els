/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { LazyQueryResult, MutationFunctionOptions, OperationVariables, QueryLazyOptions, useMutation, ApolloError } from '@apollo/client';
import { SettingOidcForm } from '@els/client/app/setting/ui';
import { ToastifyContext } from '@els/client/app/shared/contexts';
import {
  GraphqlMutations,
  GraphqlTypes,
} from '@els/client/app/shared/data-access';
import {
  ButtonCustom,
  LoadingData
} from '@els/client/app/shared/ui';
import {
  GuardianTypes
} from '@els/client/guardian/data-access';
import { ApolloClient, cross_kratos } from '@els/client/shared/data-access';
import { Box, Divider, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogConfirmValueType } from '../setting';
import Password from './ui/password';
import Profile from './ui/profile';
import { AxiosError } from 'axios';
import getConfig from 'next/config';
import { handleApolloError } from '@els/client/shared/utils';

const { publicRuntimeConfig } = getConfig();

const AccountWrapper = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
  `
);

export interface ProfileInfoType {
  username: string;
  email: string;
  phone: string;
  firstName: string;
  middleName: string;
  lastName: string;
  avatar: string;
}

export interface PasswordInfoType {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountProps {
  GetCurrentUser: (options?: QueryLazyOptions<OperationVariables> | undefined) => Promise<LazyQueryResult<{ user: GraphqlTypes.LearningTypes.User }, OperationVariables>>
  currentUser: GraphqlTypes.LearningTypes.User;
  currentAccount: GuardianTypes.AccountIdentity;
  UpdateProfile: (options?: MutationFunctionOptions) => void;
  updateProfileLoading: boolean;
  UpdatePassword: (options?: MutationFunctionOptions) => void;
  updatePasswordLoading: boolean;
  ResendVerificationEmail: (options?: MutationFunctionOptions) => void;
  resendVerificationEmailLoading: boolean;
  PreSignAvatarUrl: (options?: MutationFunctionOptions) => void;
  avatarFileRef: any;
  preSignAvatarUrl: string;
  setUploadAvatarLoading: (uploadAvatarLoading: boolean) => void;
  uploadAvatarLoading: boolean;
  handleOpenDialogConfirm: (data: DialogConfirmValueType) => void;
  error: string;
}
export const Account: FC<AccountProps> = (props) => {
  const {
    GetCurrentUser,
    currentUser,
    currentAccount,
    UpdateProfile,
    updateProfileLoading,
    UpdatePassword,
    updatePasswordLoading,
    ResendVerificationEmail,
    resendVerificationEmailLoading,
    PreSignAvatarUrl,
    avatarFileRef,
    setUploadAvatarLoading,
    uploadAvatarLoading,
    handleOpenDialogConfirm,
    error
  } = props;
  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  const [logoutToken, setLogoutToken] = useState<string>('');

  const { toastify } = useContext(ToastifyContext);

  const [DeleteDeviceGql] = useMutation(
    GraphqlMutations.LearningMutations.Device.DeleteDevice,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onError: (err: ApolloError) => handleApolloError(err, toastify),
    }
  );

  // * page ref

  // * page state

  // * handle logic
  const uploadAvatar = (avatarFile: any) => {
    setUploadAvatarLoading(true);

    avatarFileRef.current = avatarFile;

    PreSignAvatarUrl({
      variables: {
        fileName: avatarFile.name,
      },
    });
  };

  const updateProfile = (profileInfo: ProfileInfoType) => {
    UpdateProfile({
      variables: {
        updateProfileInput: {
          username: profileInfo.username,
          email: profileInfo.email,
          phone: profileInfo.phone,
          firstName: profileInfo.firstName,
          middleName: profileInfo.middleName,
          lastName: profileInfo.lastName,
          picture: profileInfo.avatar,
        },
      },
    });
  };

  const updatePassword = (passwordInfo: PasswordInfoType) => {
    UpdatePassword({
      variables: {
        updatePasswordInput: {
          currentPassword: passwordInfo.currentPassword,
          password: passwordInfo.newPassword,
          confirmPassword: passwordInfo.confirmPassword,
        },
      },
    });
  };

  const resendVerificationEmail = (email: string) => {
    if (email) {
      ResendVerificationEmail({
        variables: {
          email: email,
        },
      });
    }
  };

  const handleForgotPassword = () => {
    const currentToken = localStorage.getItem('tokenDevice');
    currentToken &&
      DeleteDeviceGql({
        variables: {
          deleteDeviceInput: {
            token: currentToken,
          },
        },
      });
    cross_kratos
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        setLogoutToken(data.logout_token);
      })
      .catch((err: AxiosError) => {
        if(err.response?.status === 401) {
          // do nothing, the user is not logged in
          return;
        } else {
          // Something else happened!
          return Promise.reject(err);
        }
      });
  };

  useEffect(() => {
    if (logoutToken) {
      cross_kratos
        .submitSelfServiceLogoutFlow(logoutToken)
        .then(
          () =>
            (window.location.href = `${publicRuntimeConfig.GUARDIAN_URL}/recovery`)
        );
    }
  }, [logoutToken]);

  // * render ui
  return (
    <AccountWrapper maxWidth="950px">
      {/* group info */}
      <Profile
        // currentUser={currentUser}
        // updateProfile={updateProfile}
        updateProfileLoading={updateProfileLoading}
        // uploadAvatar={uploadAvatar}
        // preSignAvatarUrl={preSignAvatarUrl}
        uploadAvatarLoading={uploadAvatarLoading}
        handleOpenDialogConfirm={handleOpenDialogConfirm}
        GetCurrentUser={GetCurrentUser}
      />

      <Divider
        sx={{
          mt: 4,
          width: '100%',
          height: '1px',
          backgroundColor: 'unset',
          borderBottom: `1px dashed ${theme.colors.secondary.light}`,
        }}
      />

      {/* group password */}
      <Password
        error={error}
        updatePassword={updatePassword}
        updatePasswordLoading={updatePasswordLoading}
        handleOpenDialogConfirm={handleOpenDialogConfirm}
        isLoginWithPassword={(currentAccount?.authenticationMethods ?? [''])?.includes('password')}
        sx={{ mt: 4 }}
      />

      <Divider
        sx={{
          mt: 4,
          width: '100%',
          height: '1px',
          backgroundColor: 'unset',
          borderBottom: `1px dashed ${theme.colors.secondary.light}`,
        }}
      />

      {/* group verify email */}
      <Box mt={{ xs: 2, md: 4 }}>
        <ButtonCustom
          variant="contained"
          color="primary"
          children={
            resendVerificationEmailLoading
              ? t('Sending email')
              : t('Resend verification email')
          }
          startIcon={resendVerificationEmailLoading ? <LoadingData /> : null}
          onClick={() =>
            resendVerificationEmail(currentUser.identity?.traits.email ?? '')
          }
          showCountdown
          reopenIn={15000}
          sx={{
            height: '40px',
            p: '10px 22px',
            fontSize: '15px',
            fontWeight: 700,
            lineHeight: '18px',
            width: 'fit-content',
          }}
        />
      </Box>

      <Divider
        sx={{
          mt: 4,
          width: '100%',
          height: '1px',
          backgroundColor: 'unset',
          borderBottom: `1px dashed ${theme.colors.secondary.light}`,
        }}
      />

      {/* group social network link  */}
      <SettingOidcForm sx={{ mt: 4 }} />
    </AccountWrapper>
  );
};

export default Account;

/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { ToastifyContext } from '@els/client/app/shared/contexts';
import {
  Box, Divider, Tab, Tabs, useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { FC, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BreadcrumbsCustom, ConfigIcon, Loading } from '@els/client/app/shared/ui';
import App from './app';
import Target from './target';
import Account from './account';
import { useLazyQuery, useMutation, ApolloError } from '@apollo/client';
import { GraphqlMutations, GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
import { ApolloClient } from '@els/client/shared/data-access';
import { DialogConfirm, DialogConfirmType } from '@els/client/shared/ui';
import { GuardianMutations, GuardianTypes } from '@els/client/guardian/data-access';
import axios from 'axios';
import { addAlpha, handleApolloError } from '@els/client/shared/utils';

const SettingWrapper = styled(Box)(
  ({ theme }) => `
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

const BoxWrapper = styled(Box)(
  ({ theme }) => `
    height: 0;
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

export interface DialogConfirmValueType {
  open?: boolean,
  title: ReactNode,
  message: ReactNode,
  confirmTitle?: ReactNode,
  cancelTitle?: ReactNode,
  callback?: () => void,
}

export enum SettingOptions {
  AccountSetting = 'Account',
  AppSetting = 'App',
  TargetSetting = 'Target',
}

const settingOptions = [
  { label: SettingOptions.AccountSetting, value: SettingOptions.AccountSetting },
  { label: SettingOptions.AppSetting, value: SettingOptions.AppSetting },
  { label: SettingOptions.TargetSetting, value: SettingOptions.TargetSetting },
];

export interface SettingProps {}

export const Setting: FC<SettingProps> = (props) => {
  const theme = useTheme();

  const router = useRouter();

  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  // * page ref
  const avatarFileRef = useRef<any>(null);

  // * page state
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();
  const [currentAccount, setCurrentAccount] = useState<GuardianTypes.AccountIdentity>();
  const [globalError, setGlobalError] = useState<string>('');
  interface SettingFormStateType {
    type: SettingOptions;
  }
  const initSettingFormState: SettingFormStateType = {
    type: SettingOptions.AccountSetting,
  };
  const [settingFormState, setSettingFormState] = useState<SettingFormStateType>(initSettingFormState);
  const [preSignAvatarUrl, setPreSignAvatarUrl] = useState<string>('');
  const [uploadAvatarLoading, setUploadAvatarLoading] = useState<boolean>(false);

  //* Dialog Confirm
  const initConfirmValue: DialogConfirmValueType = {
    open: false,
    title: '',
    message: '',
    confirmTitle: '',
    cancelTitle: '',
    callback: undefined,
  };
  const [dialogConfirmValue, setDialogConfirmValue] = useState(initConfirmValue);
  const handleOpenDialogConfirm = (data: DialogConfirmValueType) => {
    setDialogConfirmValue({
      open: true,
      title: data.title,
      message: data.message,
      confirmTitle: data.confirmTitle,
      cancelTitle: data.cancelTitle,
      callback: data.callback,
    });
  };
  const handleCloseDialogConfirm = () => {
    setDialogConfirmValue(initConfirmValue);
  };
  const handleConfirmDialogConfirm = (dialogConfirmValueInput: DialogConfirmValueType) => {
    if (dialogConfirmValueInput.callback) dialogConfirmValueInput.callback();

    setDialogConfirmValue(initConfirmValue);
  };

  // * load data
  const [GetCurrentUser, { loading: getCurrentUserLoading }] = useLazyQuery<{ user: GraphqlTypes.LearningTypes.User }>(
    GraphqlQueries.LearningQueries.User.GetUserSetting,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        setIsFirstRender(false);
        if (data?.user) setCurrentUser(data?.user);
      },
      onError: (err: ApolloError) => handleApolloError(err, toastify),
      fetchPolicy: 'network-only', // ? note: Because there are many feature that change the currentUser's data but do not write it to the cache, it must always reload the latest data from the database.
    }
  );

  const [GetCurrentAccount] = useLazyQuery<{ account: { current: GuardianTypes.AccountIdentity } }>(
    GraphqlQueries.LearningQueries.Account.GetCurrentAccount,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        if (data?.account?.current) setCurrentAccount(data.account.current);
      },
      onError: (err: ApolloError) => handleApolloError(err, toastify),
    }
  );

  const [UpdateProfile, { loading: updateProfileLoading }] = useMutation<{
    account: {
      updateProfile: GuardianTypes.AccountIdentity,
    }
  }>(GuardianMutations.UpdateProfile, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      toastify({
        message: t('Profile has been successfully updated'),
        type: 'success',
      });
    },
    onError: (err: ApolloError) => handleApolloError(err, toastify),
  });

  const [UpdatePassword, { loading: updatePasswordLoading }] = useMutation<{
    account: {
      updatePassword: GuardianTypes.AccountIdentity,
    }
  }>(GuardianMutations.UpdatePassword, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {

      if (data.account.updatePassword)
        toastify({
          message: t('Password has been updated successfully'),
          type: 'success',
        });
      else {
        toastify({
          message: t('Update password fail'),
          type: 'error',
        });
        setGlobalError('Current password is incorrect');
      }
    },
    onError: (err: ApolloError) => handleApolloError(err, toastify),
  });

  const [ResendVerificationEmail, { loading: resendVerificationEmailLoading }] = useMutation<{
    account: {
      requestVerify: boolean,
    }
  }>(GuardianMutations.VerifyAccount, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      if (data?.account.requestVerify) {
        toastify({
          message: t('The verification link has been sent successfully'),
          type: 'success',
        });

        toastify({
          message: `${t('Please check the mailbox of the email address')}: ${currentUser?.identity?.traits.email}`,
          type: 'success',
        });
      }
    },
    onError: (err: ApolloError) => handleApolloError(err, toastify),
  });

  const [PreSignAvatarUrl] = useMutation<{
    account: {
      preSignAvatarUrl: string,
    }
  }>(GuardianMutations.PreSignAvatarUrl, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: async (data) => {
      if (data.account.preSignAvatarUrl) {

        const formData = new FormData();
        formData.append('file', avatarFileRef.current);

        await axios({
          method: 'post',
          url: data.account.preSignAvatarUrl.replace('http://minio:9000/', 'https://localhost:9000/'), //* just work for local dev
          data: formData,
          headers: {
            'Content-Type': avatarFileRef.current.type
          },
        })
          .then((response: any) => {
            setPreSignAvatarUrl(data.account.preSignAvatarUrl);
            setUploadAvatarLoading(false);
          })
          .catch((error: any) => {
            toastify({
              message: error.message,
              type: 'error',
            });

            setUploadAvatarLoading(false);
          });
      }
    },
    onError: (err: ApolloError) => handleApolloError(err, toastify),
  });

  const [UpdateSettingApp, { loading: UpdateSettingAppLoading }] = useMutation<{
    settings: {
      updateApplication: GraphqlTypes.LearningTypes.Setting,
    }
  }>(GraphqlMutations.LearningMutations.Setting.UpdateSettingApp, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      toastify({
        message: t('App settings has been updated successfully'),
        type: 'success',
      });
    },
    onError: (err: ApolloError) => handleApolloError(err, toastify),
    refetchQueries: [
      GraphqlQueries.LearningQueries.User.GetUser,
    ],
  });

  const [UpdateSettingTarget, { loading: UpdateSettingTargetLoading }] = useMutation<{
    settings: {
      updateTarget: GraphqlTypes.LearningTypes.Setting,
    }
  }>(GraphqlMutations.LearningMutations.Setting.UpdateSettingTarget, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      toastify({
        message: t('App settings has been updated successfully'),
        type: 'success',
      });
    },
    onError: (err: ApolloError) => handleApolloError(err, toastify),
    refetchQueries: [
      GraphqlQueries.LearningQueries.User.GetUser,
    ],
  });

  // * handle logic
  const handleChangeSettingOptions = (value: SettingOptions) => {
    setSettingFormState({
      ...settingFormState,
      type: value,
    });
  };

  useEffect(() => {
    const tab: any = router.query.tab ?? SettingOptions['AccountSetting'];
    handleChangeSettingOptions(tab);
    GetCurrentUser();
    GetCurrentAccount();
  }, [router]);

  // * render ui
  return (
    <SettingWrapper
      sx={{
        height: {
          xs: 'unset',
        },
        padding: {
          xs: theme.spacing(1),
          sm: theme.spacing(2),
          md: theme.spacing(3),
          lg: theme.spacing(5),
        },
      }}
    >
      {/* title page */}
      <BreadcrumbsCustom
        title={t('Settings')}
        breadcrumbsList={[]}
        icon={<ConfigIcon width="36px" height="36px" />}
      />

      {/* content */}
      <BoxWrapper sx={{ minHeight: '100%' }}>
        <Box
          sx={{
            flex: 1,
            backgroundColor: theme.colors.alpha.white[100],
            borderRadius: '6px',
            filter: 'drop-shadow(0px 9px 16px rgba(159, 162, 191, 0.18)) drop-shadow(0px 2px 2px rgba(159, 162, 191, 0.32))',
            height: '100%',
          }}
        >
          {/* header */}
          <Box
            sx={{
              px: '20px',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent:'space-between',
            }}
          >
            <Tabs
              onChange={(e, value) => handleChangeSettingOptions(value)}
              value={settingFormState.type}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '.MuiTabs-indicator': {
                  boxShadow: 'unset',
                  border: 'unset',
                  bgcolor: theme.colors.alpha.white[100],
                }
              }}
            >
              {settingOptions.map((tab) => (
                <Tab
                  key={tab.value} label={t(tab.label)} value={tab.value}
                  sx={{
                    bgcolor: settingFormState.type ===  tab.value ? theme.colors.primary.main : 'unset',
                    boxShadow: settingFormState.type ===  tab.value ? '0px 1px 4px rgba(25, 117, 255, 0.25), 0px 3px 12px 2px rgba(25, 117, 255, 0.35)' : 'unset',
                    color: settingFormState.type ===  tab.value ? '#ffffff' : 'unset',
                    p: '8px 20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: '6px',
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* divider */}
          <Divider
            sx={{
              width: '100%',
              height: '1px',
              backgroundColor: `1px solid ${theme.palette.grey[300]}`
            }}
          />

          {/* body */}
          {
            getCurrentUserLoading && isFirstRender
              ? (
                <Loading sx={{ position: 'absolute', alignItems: 'center', backgroundColor: addAlpha('#ffffff', 0.5) }} />
              )
              : (
                <Box display="flex" alignItems="start" justifyContent="center" p={{ xs: 2, md: 5 }}>
                  {settingFormState.type === SettingOptions.AccountSetting && currentUser && currentAccount && (
                    <Account
                      GetCurrentUser={GetCurrentUser}
                      currentUser={currentUser}
                      currentAccount={currentAccount}
                      UpdateProfile={UpdateProfile}
                      updateProfileLoading={updateProfileLoading}
                      UpdatePassword={UpdatePassword}
                      updatePasswordLoading={updatePasswordLoading}
                      ResendVerificationEmail={ResendVerificationEmail}
                      resendVerificationEmailLoading={resendVerificationEmailLoading}
                      PreSignAvatarUrl={PreSignAvatarUrl}
                      avatarFileRef={avatarFileRef}
                      preSignAvatarUrl={preSignAvatarUrl}
                      uploadAvatarLoading={uploadAvatarLoading}
                      setUploadAvatarLoading={setUploadAvatarLoading}
                      handleOpenDialogConfirm={handleOpenDialogConfirm}
                      error={globalError}
                    />
                  )}
                  {settingFormState.type === SettingOptions.AppSetting && currentUser && (
                    <App
                      currentUser={currentUser}
                      UpdateSettingApp={UpdateSettingApp}
                      UpdateSettingAppLoading={UpdateSettingAppLoading}
                      handleOpenDialogConfirm={handleOpenDialogConfirm}
                    />
                  )}
                  {settingFormState.type === SettingOptions.TargetSetting && currentUser && (
                    <Target
                      currentUser={currentUser}
                      UpdateSettingTarget={UpdateSettingTarget}
                      UpdateSettingTargetLoading={UpdateSettingTargetLoading}
                      handleOpenDialogConfirm={handleOpenDialogConfirm}
                    />
                  )}
                </Box>
              )
          }
        </Box>
      </BoxWrapper>

      {/* dialog confirm */}
      {dialogConfirmValue.open && (
        <DialogConfirm
          open={dialogConfirmValue.open ?? false}
          type={DialogConfirmType.success}
          message={dialogConfirmValue.message}
          title={dialogConfirmValue.title}
          onCancel={handleCloseDialogConfirm}
          onConfirm={() => handleConfirmDialogConfirm(dialogConfirmValue)}
          confirmTitle={dialogConfirmValue.confirmTitle}
          cancelTitle={dialogConfirmValue.cancelTitle}
        />
      )}
    </SettingWrapper>
  );
};

export default Setting;

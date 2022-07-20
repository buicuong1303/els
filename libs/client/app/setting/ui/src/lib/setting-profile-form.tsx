/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react-hooks/exhaustive-deps */
import { DialogConfirmValueType } from '@els/client/app/setting/feature';
import { ToastifyContext } from '@els/client/app/shared/contexts';
import {
  ButtonCustom,
  LoadingData,
  UploadIcon,
} from '@els/client/app/shared/ui';
import { GuardianMutations } from '@els/client/guardian/data-access';
import { ApolloClient, cross_kratos } from '@els/client/shared/data-access';
import { Avatar, Box, Button, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody,
} from '@ory/client';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleFlowError } from '../errors';
import { SettingProfileFlow } from '../ui';
import {
  LazyQueryResult,
  OperationVariables,
  QueryLazyOptions,
  useMutation,
  ApolloError
} from '@apollo/client';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { handleApolloError } from '@els/client/shared/utils';
interface SettingProfileFormProps {
  GetCurrentUser: (
    options?: QueryLazyOptions<OperationVariables> | undefined
  ) => Promise<
  LazyQueryResult<
  { user: GraphqlTypes.LearningTypes.User },
  OperationVariables
  >
  >;
  handleOpenDialogConfirm: (data: DialogConfirmValueType) => void;
  updateProfileLoading: boolean;
  sx?: SxProps;
}

export function readAsArrayBuffer(file: File) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      if (
        file.type.split('/')[0] === 'image' &&
        file.type !== 'image/tif' &&
        file.type !== 'image/tiff'
      ) {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = function () {
          URL.revokeObjectURL(image.src);
          return resolve({
            data: fileReader.result,
            name: file.name || '',
            size: file.size,
            type: file.type,
          });
        };
      } else {
        return resolve({
          data: fileReader.result,
          name: file.name || '',
          size: file.size,
          type: file.type,
        });
      }
    };
    fileReader.readAsArrayBuffer(file);
  });
}

//TODO: need change login flow to sessionCookie flow (current is sessionToken flow)
const SettingProfileForm: FC<SettingProfileFormProps> = (props) => {
  const { GetCurrentUser, handleOpenDialogConfirm, updateProfileLoading, sx } =
    props;

  const theme = useTheme();

  const router = useRouter();

  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  // * page ref
  const avatarFileRef = useRef<any>(null);
  const buttonSaveRef = useRef<any>(null);
  const buttonCancelRef = useRef<any>(null);
  const formValuesRef = useRef<any>({});

  // * page state
  const [uploadAvatarLoading, setUploadAvatarLoading] = useState(false);
  const [flow, setFlow] = useState<SelfServiceSettingsFlow>();
  const [flowLoading, setFlowLoading] = useState<boolean>(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState<string>('');
  const [canUpdate, setCanUpdate] = useState<boolean>(false);

  function setFlowData(data: any) {
    setFlow(data as SelfServiceSettingsFlow);
    GetCurrentUser();

    toastify({
      message: 'Update success',
      type: 'success',
    });

    setCanUpdate(false);
  }

  async function handleAxiosError(err: AxiosError) {
    if (err.response?.status === 400) {
      // Yup, it is!
      setFlow(err.response?.data);
      return;
    }

    return Promise.reject(err);
  }

  const initializeService = () => {
    if(returnTo) {
      return String(returnTo);
    }
    return undefined;
  };

  // * access data
  const [PreSignAvatarUrl] = useMutation<{
    account: {
      preSignAvatarUrl: string;
    };
  }>(GuardianMutations.PreSignAvatarUrl, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: async (dataInput) => {
      if (dataInput.account.preSignAvatarUrl) {
        await axios({
          method: 'put',
          url: dataInput.account.preSignAvatarUrl,
          data: avatarFileRef.current,
          headers: { 'Content-Type': avatarFileRef.current.type },
        })
          .then((response: any) => {
            const uploadedUrl = response.config.url.split('?')[0];
            // setPreSignAvatarUrl(data.account.preSignAvatarUrl);
            setUploadAvatarLoading(false);
            return (
              router
                // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
                // his data when she/he reloads the page.
                .push(`/settings?flow=${flow?.id}`, undefined, {
                  shallow: true,
                })
                .then(() => {
                  cross_kratos
                    .submitSelfServiceSettingsFlow(String(flow?.id), {
                      ...formValuesRef.current,
                      'traits.picture': uploadedUrl,
                    })
                    .then(({ data }) => {
                      // The settings have been saved and the flow was updated. Let's show it to the user!
                      setFlowData(data);
                    })
                    .catch(handleFlowError(router, 'settings', setFlow))
                    .catch(handleAxiosError);
                })
            );
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

  // * handle logic
  const {
    return_to: returnTo,
    flow: flowId,
    // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
    // of a user.
    refresh,
    // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
    // to perform two-factor authentication/verification.
    aal,
  } = router.query;

  const handleSetCurrentAvatar = (url: string) => {
    setCurrentAvatar(url);
  };

  const onSubmit = async (values: SubmitSelfServiceSettingsFlowBody) => {
    if (avatarUrl) {
      formValuesRef.current = values;

      PreSignAvatarUrl({
        variables: {
          fileName: avatarFileRef.current.name,
        },
      });

      return;
    }

    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/settings?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          cross_kratos
            .submitSelfServiceSettingsFlow(String(flow?.id), {
              ...values,
              method: 'profile',
            })
            .then(({ data }) => {
              // The settings have been saved and the flow was updated. Let's show it to the user!
              setFlowData(data);
            })
            .catch(handleFlowError(router, 'settings', setFlow))
            .catch(handleAxiosError)
        )
    );
  };

  const handleUploadAvatar = (event: any) => {
    setUploadAvatarLoading(true);
    const avatarFile = event.target.files?.[0];

    if (avatarFile) {
      avatarFileRef.current = avatarFile;
      setAvatarUrl(URL.createObjectURL(avatarFileRef.current));

      setCanUpdate(true);
    }
    setUploadAvatarLoading(false);
  };

  const handleSubmit = () => {
    if (buttonSaveRef.current) buttonSaveRef.current.click();
  };

  const handleCancel = () => {
    cross_kratos
      .initializeSelfServiceSettingsFlowForBrowsers(initializeService())
      .then(({ data }) => {
        setFlow(data as SelfServiceSettingsFlow);
      });

    setAvatarUrl('');

    if (buttonCancelRef.current) buttonCancelRef.current.click();
  };

  // * useEffect
  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    setFlowLoading(true);

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      cross_kratos
        .getSelfServiceSettingsFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data as SelfServiceSettingsFlow);
          setFlowLoading(false);
        });
      // .catch(handleGetFlowError(router, 'login', setFlow));
      return;
    }

    // Otherwise we initialize it
    cross_kratos
      .initializeSelfServiceSettingsFlowForBrowsers(initializeService())
      .then(({ data }) => {
        setFlow(data as SelfServiceSettingsFlow);
        setFlowLoading(false);
      });
    // .catch(handleFlowError(router, 'settings', setFlow));
  }, [flowId, router, router.isReady, aal, refresh, returnTo]);

  return (
    <Box sx={sx}>
      {flow?.ui.messages &&
        flow?.ui.messages?.filter((message) => message.type === 'error')
          .length > 0 && (
        <Box
          sx={{
            bgcolor: '#ffebe9',
            p: theme.spacing(2),
            mb: theme.spacing(2),
            fontSize: '13px',
            borderRadius: '5px',
            border: '1px solid #ff818266',
          }}
        >
          {flow?.ui.messages
            .filter((message) => message.type === 'error')
            ?.map((message) => {
              return <Box>{t(message.text)}</Box>;
            })}
        </Box>
      )}

      <Box sx={{ visibility: flowLoading ? 'hidden' : 'visible' }}>
        <Grid
          container
          columnSpacing={2}
          rowSpacing={{ xs: 2, md: 5 }}
          alignItems="start"
          direction="row-reverse"
        >
          <Grid item xs={12} md={3}>
            <Box position="relative" height="fit-content">
              <Avatar
                variant="rounded"
                sx={{
                  marginLeft: 'auto',
                  width: { xs: '100%', sm: '120px', md: '240px' },
                  height: { xs: 'unset', sm: '120px', md: '240px' },
                  maxWidth: '100%',
                  p: 0,
                  borderRadius: { xs: '28px', sm: '16px', md: '28px' },
                  filter:
                    'drop-shadow(0px 12.7841px 22.7273px rgba(159, 162, 191, 0.18)) drop-shadow(0px 2.84092px 2.84092px rgba(159, 162, 191, 0.32))',
                }}
                src={avatarUrl ? avatarUrl : currentAvatar}
              />
              <Box
                sx={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  transform: 'translate(30%, 30%)',
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    width: { xs: '48px', sm: '36px', md: '48px' },
                    height: { xs: '48px', sm: '36px', md: '48px' },
                    p: 0,
                    borderRadius: '50%',
                    minWidth: 'unset',
                    '& .MuiButton-startIcon': {
                      m: '0px !important',
                    },
                  }}
                >
                  {uploadAvatarLoading ? <LoadingData /> : <UploadIcon />}
                  <input
                    id="avatar_input"
                    type="file"
                    accept="image/*"
                    // onClick={(e) => e.target.value = null}
                    onChange={handleUploadAvatar}
                    hidden
                  />
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <SettingProfileFlow
              hideGlobalMessages
              onSubmit={onSubmit}
              only="profile"
              flow={flow}
              onSetCurrentAvatar={handleSetCurrentAvatar}
              buttonSaveRef={buttonSaveRef}
              buttonCancelRef={buttonCancelRef}
              handleOpenDialogConfirm={handleOpenDialogConfirm}
              t={t}
              setCanUpdate={setCanUpdate}
            />
          </Grid>
        </Grid>

        <Box width="100%" display="flex" justifyContent="end">
          <ButtonCustom
            variant="outlined"
            color="secondary"
            children={t('Cancel')}
            onClick={handleCancel}
            sx={{
              px: '30px',
              py: '10px',
              fontSize: '15px',
              fontWeight: 700,
              lineHeight: '18px',
            }}
          />
          <ButtonCustom
            variant="contained"
            {...updateProfileLoading ? {
              children: t('Updating'),
              startIcon: <LoadingData />
            } : {
              children: t('Update'),
              startIcon: null
            }}
            onClick={handleSubmit}
            rest={{
              disabled: !canUpdate,
            }}
            sx={{
              ml: 2.5,
              px: '30px',
              py: '10px',
              fontSize: '15px',
              fontWeight: 700,
              lineHeight: '18px',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { SettingProfileForm };

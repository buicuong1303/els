/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react-hooks/exhaustive-deps */
import { ToastifyContext } from '@els/client/app/shared/contexts';
import { ButtonCustom, LoadingData } from '@els/client/app/shared/ui';
import { cross_kratos } from '@els/client/shared/data-access';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody
} from '@ory/client';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { handleFlowError } from '../errors';
import { useTranslation } from 'react-i18next';
import SettingPasswordFlow from '../ui/setting-password-flow';
import { DialogConfirmValueType } from '@els/client/app/setting/feature';
interface SettingPasswordFormInterface {
  sx?: SxProps;
  handleOpenDialogConfirm: (data: DialogConfirmValueType) => void;
  updatePasswordLoading: boolean;
}

//TODO: need change login flow to sessionCookie flow (current is sessionToken flow)
const SettingPasswordForm: FC<SettingPasswordFormInterface> = (props) => {
  const { sx, handleOpenDialogConfirm, updatePasswordLoading } = props;

  const router = useRouter();

  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  const buttonSaveRef = useRef<any>(null);
  const buttonCancelRef = useRef<any>(null);

  const [flowLoading, setFlowLoading] = useState<boolean>(true);
  const [flow, setFlow] = useState<SelfServiceSettingsFlow>();
  const [canUpdate, setCanUpdate] = useState<boolean>(false);

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

  const handleSubmit = () => {
    if (buttonSaveRef.current) buttonSaveRef.current.click();
  };

  const initializeService = () => {
    if(returnTo) {
      return String(returnTo);
    }
    return undefined;
  };

  const handleCancel = () => {
    cross_kratos
      .initializeSelfServiceSettingsFlowForBrowsers(initializeService())
      .then(({ data }) => {
        setFlow(data as SelfServiceSettingsFlow );
      });

    if (buttonCancelRef.current) buttonCancelRef.current.click();
  };

  async function handleAxiosError (err: AxiosError) {
    // If the previous handler did not catch the error it's most likely a form validation error
    if (err.response?.status === 400) {
      // Yup, it is!
      setFlow(err.response?.data);
      return;
    }
    return Promise.reject(err);
  }

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

  const onSubmit: any = async (values: SubmitSelfServiceSettingsFlowBody)  => {
    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/settings?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          cross_kratos
            .submitSelfServiceSettingsFlow(String(flow?.id), {...values, method: 'password'})
            .then(({ data }) => {
              // The settings have been saved and the flow was updated. Let's show it to the user!
              setFlow(data as SelfServiceSettingsFlow);
              toastify({
                message: 'Update success',
                type: 'success',
              });

              setCanUpdate(false);
            })
            .catch(handleFlowError(router, 'settings', setFlow))
            .catch(handleAxiosError)
        )
    );
  };

  return (
    <Box sx={{ visibility: flowLoading ? 'hidden' : 'visible', ...sx}} >
      <SettingPasswordFlow
        hideGlobalMessages
        onSubmit={onSubmit}
        only="password"
        flow={flow}
        buttonSaveRef={buttonSaveRef}
        buttonCancelRef={buttonCancelRef}
        handleOpenDialogConfirm={handleOpenDialogConfirm}
        t={t}
        setCanUpdate={setCanUpdate}
      />

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
          {...updatePasswordLoading ? {
            children: t('Updating'),
            startIcon: <LoadingData />
          } : {
            children: t('Update'),
            startIcon: null
          }}
          onClick={handleSubmit}
          rest={{
            disabled: !canUpdate
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
  );
};

export { SettingPasswordForm };

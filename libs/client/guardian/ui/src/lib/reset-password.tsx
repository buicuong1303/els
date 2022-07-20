/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { kratos } from '@els/client/shared/data-access';
import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody
} from '@ory/client';
import { AxiosError } from 'axios';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleFlowError } from '../errors';
import { ResetPasswordFlow } from '../ui';

const { publicRuntimeConfig } = getConfig();


const ResetPasswordForm: FC = () => {
  const { t }: { t: any } = useTranslation();

  const router = useRouter();
  const { flow: flowId, return_to: returnTo } = router.query;

  // * init values formik form
  const [flow, setFlow] = useState<SelfServiceSettingsFlow>();

  // * handle logic

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      kratos
        .getSelfServiceSettingsFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data as SelfServiceSettingsFlow);
        })
        .catch(handleFlowError(router, 'settings', setFlow));
      return;
    }

    // Otherwise we initialize it
    kratos
      .initializeSelfServiceSettingsFlowForBrowsers(
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data as SelfServiceSettingsFlow);
      })
      .catch(handleFlowError(router, 'settings', setFlow));
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit: any = (values: SubmitSelfServiceSettingsFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/reset-password?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        kratos
          .submitSelfServiceSettingsFlow(String(flow?.id), values, undefined  )
          .then(({ data }) => {
            // The settings have been saved and the flow was updated. Let's show it to the user!
            setFlow(data as SelfServiceSettingsFlow);
            window.location.href = publicRuntimeConfig.APP_URL || '';
          })
          .catch(handleFlowError(router, 'reset-password', setFlow))
          .catch(async (err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data);
              return;
            }

            return Promise.reject(err);
          })
      );

  return (
    <ResetPasswordFlow hideGlobalMessages onSubmit={onSubmit} only="password" flow={flow} />
  );
};

export { ResetPasswordForm };

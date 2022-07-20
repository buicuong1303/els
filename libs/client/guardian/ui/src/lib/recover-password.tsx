/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ToastifyContext } from '@els/client/app/shared/contexts';
import { kratos } from '@els/client/shared/data-access';
import {
  SelfServiceRecoveryFlow,
  SubmitSelfServiceRecoveryFlowBody
} from '@ory/client';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleFlowError } from '../errors';
import { Flow } from '../ui';


const RecoveryPasswordForm: FC = () => {
  const { t }: { t: any } = useTranslation();
  const [flow, setFlow] = useState<SelfServiceRecoveryFlow>();
  const router = useRouter();
  const { flow: flowId, return_to: returnTo } = router.query;
  const { toastify } = useContext(ToastifyContext);

  // * init values formik form

  const onSubmit = (values: SubmitSelfServiceRecoveryFlowBody) => {
    return router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/recovery?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        kratos
          .submitSelfServiceRecoveryFlow(String(flow?.id), { ...values, method: 'link'}, undefined)
          .then(({ data }) => {
            // Form submission was successful, show the message to the user!
            setFlow(data as SelfServiceRecoveryFlow);
            toastify({ message: t('A verification link has been sent to your email account'), type: 'success' });
          })
          .catch(handleFlowError(router, 'recovery', setFlow))
          .catch((err: AxiosError) => {
            switch (err.response?.status) {
              case 400:
                // Status code 400 implies the form validation had an error
                setFlow(err.response?.data);
                return;
            }

            throw err;
          })
      );
  };


  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      kratos
        .getSelfServiceRecoveryFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data as SelfServiceRecoveryFlow);
        })
        .catch(handleFlowError(router, 'recovery', setFlow));
      return;
    }

    // Otherwise we initialize it
    kratos
      .initializeSelfServiceRecoveryFlowForBrowsers()
      .then(({ data }) => {
        setFlow(data as SelfServiceRecoveryFlow);
      })
      .catch(handleFlowError(router, 'recovery', setFlow))
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data);
          return;
        }

        return Promise.reject(err);
      });
  }, [flowId, router, router.isReady, returnTo, flow]);
  return (
    <Flow onSubmit={onSubmit} flow={flow} />
  );
};

export { RecoveryPasswordForm };

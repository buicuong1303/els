/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react-hooks/exhaustive-deps */
import type { FC } from 'react';
import { AxiosError } from 'axios';
import { useState, useEffect, useContext } from 'react';

import { useRouter } from 'next/router';

import { ToastifyContext } from '@els/client/app/shared/contexts';

import { kratos } from '@els/client/shared/data-access';
import { RegisterFlow } from '../ui';
import { handleFlowError } from '../errors';
import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody,
} from '@ory/client';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

interface RegisterFormProps {}

const RegisterForm: FC<RegisterFormProps> = (props) => {
  const router = useRouter();
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow>();

  // Get ?flow=... from the URL
  const { flow: flowId, return_to: returnTo } = router.query;

  const { toastify } = useContext(ToastifyContext);

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      kratos
        .getSelfServiceRegistrationFlow(String(flowId))
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data as SelfServiceRegistrationFlow);
        })
        .catch(handleFlowError(router, 'registration', setFlow));
      return;
    }

    // Otherwise we initialize it
    kratos
      .initializeSelfServiceRegistrationFlowForBrowsers(
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        data.ui.nodes = data.ui.nodes.filter((node) => node.group !== 'oidc');
        setFlow(data as SelfServiceRegistrationFlow);
      })
      .catch(handleFlowError(router, 'registration', setFlow));
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit: any = (values: SubmitSelfServiceRegistrationFlowBody) => {
    return router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/registration?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        kratos
          .submitSelfServiceRegistrationFlow(String(flow?.id), {...values, method: 'password'})
          .then(({ data }) => {
            // If we ended up here, it means we are successfully signed up!
            //
            // You can do cool stuff here, like having access to the identity which just signed up:
            //TODO create user in learning service
            // For now however we just want to redirect home!
            window.location.href = `${publicRuntimeConfig.APP_URL}/` || '';
          })
          .catch(handleFlowError(router, 'registration', setFlow))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data);
              return;
            }

            return Promise.reject(err);
          })
      );
  };

  return (
    <RegisterFlow onSubmit={onSubmit} flow={flow} toastify={toastify} />
  );
};

export { RegisterForm };

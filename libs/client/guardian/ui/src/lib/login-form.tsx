/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react-hooks/exhaustive-deps */
import { kratos } from '@els/client/shared/data-access';
import {
  Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody
} from '@ory/client';
import { AxiosError } from 'axios';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleFlowError, handleGetFlowError } from '../errors';
import { LoginFlow } from '../ui';


const { publicRuntimeConfig } = getConfig();

interface LoginFormProps {}

//TODO: need change login flow to sessionCookie flow (current is sessionToken flow)
const LoginForm: FC<LoginFormProps> = (props) => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow>();
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();

  const router = useRouter();
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


  // * init values formik form


  // * handle logic

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      kratos
        .getSelfServiceLoginFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data as SelfServiceLoginFlow);
        })
        .catch(handleGetFlowError(router, 'login', setFlow));
      return;
    }

    // Otherwise we initialize it
    kratos
      .initializeSelfServiceLoginFlowForBrowsers(
        Boolean(refresh),
        aal ? String(aal) : undefined,
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data as SelfServiceLoginFlow);
      })
      .catch(handleFlowError(router, 'login', setFlow));
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow]);

  const onSubmit: any = (values: SubmitSelfServiceLoginFlowBody) => {

    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
        .then(() =>
          kratos
            .submitSelfServiceLoginFlow(String(flow?.id), values, undefined  )
            // We logged in successfully! Let's bring the user home.
            .then((res) => {
              if (flow?.return_to) {
                window.location.href = flow?.return_to;
                return;
              }
              window.location.href = `${publicRuntimeConfig.APP_URL}/` || '';
            })
            .catch(handleFlowError(router, 'login', setFlow))
            .catch((err: AxiosError) => {
              // If the previous handler did not catch the error it's most likely a form validation error
              if (err.response?.status === 400) {
                // Yup, it is!
                setFlow(err.response?.data);
                return;
              }
              return Promise.reject(err);
            })
        )
    );
  };

  return (
    <>
      {flow?.ui.messages && flow?.ui.messages?.filter((message) => message.type === 'error').length > 0 && (
        <Box
          sx={{
            bgcolor: '#ffebe9',
            p: theme.spacing(2),
            mb:theme.spacing(2),
            fontSize: '13px',
            borderRadius: '5px',
            border: '1px solid #ff818266',
          }}
        >
          {flow?.ui.messages.filter((message) => message.type === 'error')?.map((message) => {
            return <Box>{t(message.text)}</Box>;
          })}
        </Box>
      )}

      <LoginFlow onSubmit={onSubmit} flow={flow} router={router} />
    </>
  );
};

export { LoginForm };

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react-hooks/exhaustive-deps */
import { cross_kratos, ApolloClient } from '@els/client/shared/data-access';
import { Box } from '@mui/material';
import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody,
} from '@ory/client';
import { AxiosError } from 'axios';
import { handleFlowError } from '../errors';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { SettingOicdFlow } from '../ui';
import { GraphqlQueries } from '@els/client/app/shared/data-access';
import { useLazyQuery } from '@apollo/client';
import { SxProps } from '@mui/system';
interface SettingOidcFormProps {
  sx?: SxProps;
}

//TODO: need change login flow to sessionCookie flow (current is sessionToken flow)
const SettingOidcForm: FC<SettingOidcFormProps> = (props) => {
  const { sx } = props;

  const [flow, setFlow] = useState<SelfServiceSettingsFlow>();
  const [formValues, setFormValues] =
    useState<SubmitSelfServiceSettingsFlowBody>();
  const [LinkSocialNetwork] = useLazyQuery(
    GraphqlQueries.LearningQueries.Setting.LinkSocialNetwork,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (dataInput) => {
        if(formValues){
          return (
            router
              // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
              // his data when she/he reloads the page.
              .push(`/settings?flow=${flow?.id}`, undefined, { shallow: true })
              .then(() =>
                cross_kratos
                  .submitSelfServiceSettingsFlow(
                    String(flow?.id),
                    formValues
                  )
                  .then(({ data }) => {
                    // The settings have been saved and the flow was updated. Let's show it to the user!
                    setFlow(data);
                  })
                  .catch(handleFlowError(router, 'settings', setFlow))
                  .catch(async (err: AxiosError) => {
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
        }
      },
      fetchPolicy: 'no-cache', // ? note: If the data is cached on the client, the next requests will not run on onCompleted
      // onError: (error) => {
      //   toastify({
      //     message: error.message,
      //     type: 'error',
      //   });
      // },
    }
  );

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

  // * form state

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      cross_kratos
        .getSelfServiceSettingsFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data as SelfServiceSettingsFlow);
        });
      // .catch(handleGetFlowError(router, 'login', setFlow));
      return;
    }

    // Otherwise we initialize it
    cross_kratos
      .initializeSelfServiceSettingsFlowForBrowsers(
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data as SelfServiceSettingsFlow);
      });
    // .catch(handleFlowError(router, 'settings', setFlow));
  }, [flowId, router, router.isReady, aal, refresh, returnTo]);

  const onSubmit = async (values: SubmitSelfServiceSettingsFlowBody) => {
    setFormValues(values);
    LinkSocialNetwork({
      variables: {
        //? because apollo client does not run when variables does not change
        test: Math.random(),
      },
    });
  };

  return (
    <Box sx={sx}>
      <SettingOicdFlow
        hideGlobalMessages
        onSubmit={onSubmit}
        only="oidc"
        flow={flow}
      />
    </Box>
  );
};

export { SettingOidcForm };

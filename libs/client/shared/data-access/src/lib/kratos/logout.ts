import { ApolloClient } from '@apollo/client';
import { V0alpha2Api } from '@ory/kratos-client';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const logoutKratos = async (apolloClient: ApolloClient<any>, kratos: V0alpha2Api) => {
  await apolloClient.clearStore();
  localStorage.removeItem('tokenDevice');


  try {
    const { data } = await kratos.createSelfServiceLogoutFlowUrlForBrowsers();
    await kratos.submitSelfServiceLogoutFlow(data.logout_token);
  } finally {
    window.location.href = `${publicRuntimeConfig.GUARDIAN_URL}/login`;
  }
};

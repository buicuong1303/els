import { Configuration, V0alpha2Api } from '@ory/kratos-client'
import { axios } from './axios.client';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const kratos = new V0alpha2Api(
  new Configuration({
    basePath: publicRuntimeConfig.KRATOS_PUBLIC_URL_CLIENT,
  }),
  publicRuntimeConfig.KRATOS_PUBLIC_URL_CLIENT,
  axios
);

export const cross_kratos = new V0alpha2Api(
  new Configuration({
    basePath: publicRuntimeConfig.CROSS_KRATOS_PUBLIC_URL_CLIENT,
  }),
  publicRuntimeConfig.CROSS_KRATOS_PUBLIC_URL_CLIENT,
  axios
);

export * from './logout';

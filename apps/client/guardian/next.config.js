// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
require('dotenv').config();
const { i18n } = require('./next-i18next.config');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  swcMinify: false,
};

// module.exports = withNx(nextConfig);

module.exports = withPlugins(
  [
    withImages({
      i18n,
    }),
   withNx(nextConfig),
  ],
  {
    reactStrictMode: false,
    serverRuntimeConfig: {
      HTTP_LINK_SERVER: process.env.HTTP_LINK_SERVER,
      HTTP_LINK_BROWSER: process.env.HTTP_LINK_BROWSER,
      WS_LINK: process.env.WS_LINK,
      COOKIES_URL: process.env.COOKIES_URL,
      APP_URL: process.env.APP_URL,
      CROSS_KRATOS_PUBLIC_URL_CLIENT: process.env.CROSS_KRATOS_PUBLIC_URL_CLIENT,
      KRATOS_PUBLIC_URL_CLIENT: process.env.KRATOS_PUBLIC_URL_CLIENT,
      GUARDIAN_URL: process.env.GUARDIAN_URL,
      ENABLE_CHATWOOT: process.env.ENABLE_CHATWOOT,
    },
    publicRuntimeConfig: {
      HTTP_LINK_SERVER: process.env.HTTP_LINK_SERVER,
      HTTP_LINK_BROWSER: process.env.HTTP_LINK_BROWSER,
      WS_LINK: process.env.WS_LINK,
      COOKIES_URL: process.env.COOKIES_URL,
      APP_URL: process.env.APP_URL,
      CROSS_KRATOS_PUBLIC_URL_CLIENT: process.env.CROSS_KRATOS_PUBLIC_URL_CLIENT,
      KRATOS_PUBLIC_URL_CLIENT: process.env.KRATOS_PUBLIC_URL_CLIENT,
      GUARDIAN_URL: process.env.GUARDIAN_URL,
      ENABLE_CHATWOOT: process.env.ENABLE_CHATWOOT,
    },
    env: {
      HTTP_LINK_SERVER: process.env.HTTP_LINK_SERVER,
      HTTP_LINK_BROWSER: process.env.HTTP_LINK_BROWSER,
      WS_LINK: process.env.WS_LINK,
      COOKIES_URL: process.env.COOKIES_URL,
      APP_URL: process.env.APP_URL,
      CROSS_KRATOS_PUBLIC_URL_CLIENT: process.env.CROSS_KRATOS_PUBLIC_URL_CLIENT,
      KRATOS_PUBLIC_URL_CLIENT: process.env.KRATOS_PUBLIC_URL_CLIENT,
      GUARDIAN_URL: process.env.GUARDIAN_URL,
      ENABLE_CHATWOOT: process.env.ENABLE_CHATWOOT,
    },
  }
);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
require('dotenv').config();
const { i18n } = require('./next-i18next.config');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');

const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@babel/preset-react',
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
]);

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
    withImages({ i18n }),
    withTM(withNx(nextConfig)),
  ],
  {
    reactStrictMode: false,
    serverRuntimeConfig: {
      HTTP_LINK_SERVER: process.env.HTTP_LINK_SERVER,
      HTTP_LINK_BROWSER: process.env.HTTP_LINK_BROWSER,
      WS_LINK: process.env.WS_LINK,
      COOKIES_URL: process.env.COOKIES_URL,
      GUARDIAN_URL: process.env.GUARDIAN_URL,
      TOPIC_LIMIT: process.env.TOPIC_LIMIT,
      RANK_LIMIT: process.env.RANK_LIMIT,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      FIREBASE_REDIRECT_URL: process.env.FIREBASE_REDIRECT_URL,

      MISSION_PAGE_RELEASE_DATE: process.env.MISSION_PAGE_RELEASE_DATE,
      MISSION_DETAILS_PAGE_RELEASE_DATE: process.env.MISSION_DETAILS_PAGE_RELEASE_DATE,
      CUSTOMIZATIONS_PAGE_RELEASE_DATE: process.env.CUSTOMIZATIONS_PAGE_RELEASE_DATE,
      DASHBOARD_PAGE_RELEASE_DATE: process.env.DASHBOARD_PAGE_RELEASE_DATE,
      HOME_PAGE_RELEASE_DATE: process.env.HOME_PAGE_RELEASE_DATE,

      CROSS_KRATOS_PUBLIC_URL_CLIENT: process.env.CROSS_KRATOS_PUBLIC_URL_CLIENT,
      KRATOS_PUBLIC_URL_CLIENT: process.env.KRATOS_PUBLIC_URL_CLIENT,
      ENABLE_CHATWOOT: process.env.ENABLE_CHATWOOT,
    },
    publicRuntimeConfig: {
      HTTP_LINK_SERVER: process.env.HTTP_LINK_SERVER,
      HTTP_LINK_BROWSER: process.env.HTTP_LINK_BROWSER,
      WS_LINK: process.env.WS_LINK,
      COOKIES_URL: process.env.COOKIES_URL,
      GUARDIAN_URL: process.env.GUARDIAN_URL,
      TOPIC_LIMIT: process.env.TOPIC_LIMIT,
      RANK_LIMIT: process.env.RANK_LIMIT,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      FIREBASE_REDIRECT_URL: process.env.FIREBASE_REDIRECT_URL,

      MISSION_PAGE_RELEASE_DATE: process.env.MISSION_PAGE_RELEASE_DATE,
      MISSION_DETAILS_PAGE_RELEASE_DATE: process.env.MISSION_DETAILS_PAGE_RELEASE_DATE,
      CUSTOMIZATIONS_PAGE_RELEASE_DATE: process.env.CUSTOMIZATIONS_PAGE_RELEASE_DATE,
      DASHBOARD_PAGE_RELEASE_DATE: process.env.DASHBOARD_PAGE_RELEASE_DATE,
      HOME_PAGE_RELEASE_DATE: process.env.HOME_PAGE_RELEASE_DATE,

      CROSS_KRATOS_PUBLIC_URL_CLIENT: process.env.CROSS_KRATOS_PUBLIC_URL_CLIENT,
      KRATOS_PUBLIC_URL_CLIENT: process.env.KRATOS_PUBLIC_URL_CLIENT,
      ENABLE_CHATWOOT: process.env.ENABLE_CHATWOOT,
    },
    env: {
      HTTP_LINK_SERVER: process.env.HTTP_LINK_SERVER,
      HTTP_LINK_BROWSER: process.env.HTTP_LINK_BROWSER,
      WS_LINK: process.env.WS_LINK,
      COOKIES_URL: process.env.COOKIES_URL,
      GUARDIAN_URL: process.env.GUARDIAN_URL,
      TOPIC_LIMIT: process.env.TOPIC_LIMIT,
      RANK_LIMIT: process.env.RANK_LIMIT,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      FIREBASE_REDIRECT_URL: process.env.FIREBASE_REDIRECT_URL,

      MISSION_PAGE_RELEASE_DATE: process.env.MISSION_PAGE_RELEASE_DATE,
      MISSION_DETAILS_PAGE_RELEASE_DATE: process.env.MISSION_DETAILS_PAGE_RELEASE_DATE,
      CUSTOMIZATIONS_PAGE_RELEASE_DATE: process.env.CUSTOMIZATIONS_PAGE_RELEASE_DATE,
      DASHBOARD_PAGE_RELEASE_DATE: process.env.DASHBOARD_PAGE_RELEASE_DATE,
      HOME_PAGE_RELEASE_DATE: process.env.HOME_PAGE_RELEASE_DATE,

      CROSS_KRATOS_PUBLIC_URL_CLIENT: process.env.CROSS_KRATOS_PUBLIC_URL_CLIENT,
      KRATOS_PUBLIC_URL_CLIENT: process.env.KRATOS_PUBLIC_URL_CLIENT,
      ENABLE_CHATWOOT: process.env.ENABLE_CHATWOOT,
    },
  }
);

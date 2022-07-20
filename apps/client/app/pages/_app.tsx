import { ReactElement, ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@els/client-shared-theme';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { createEmotionCache } from '@els/client/shared/utils';
import {
  LoadingProvider,
  PermissionProvider,
  SidebarProvider,
  ToastifyProvider,
} from '@els/client/app/shared/contexts';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useScrollTop } from '@els/client-shared-hooks';
import React from 'react';
import { NextSeo } from 'next-seo';
import { ApolloProvider } from '@apollo/client';
import { Box } from '@mui/system';
import { ApolloClient } from '@els/client/shared/data-access';
import dynamic from 'next/dynamic';
import 'nprogress/nprogress.css';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-slideshow-image/dist/styles.css';
import './styles.scss';
import { ChatwootWidget } from '@els/client/shared/components';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

// disable init in server-side
const NotificationProvider = dynamic(() =>
  // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
  import('@els/client/app/shared/components')
    .then((mod) => mod.NotificationProvider), { ssr: false}
) as ({ props }: any) => JSX.Element;

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

function CustomApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const apolloClient = ApolloClient.useApollo(pageProps);
  const TIMEOUT = 400;

  useScrollTop();
  useEffect(() => {
    return () => (window.onbeforeunload = null);
  }, []);

  return (
    <React.Fragment>
      <NextSeo
        title="Yummy English"
        description="Yummy English Website"
        canonical={publicRuntimeConfig.SITE_URL}
        additionalMetaTags={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
          },
        ]}
        openGraph={{
          url: `${publicRuntimeConfig.SITE_URL}`,
          title: 'Yummy English',
          description: 'Yummy English Website',
          site_name: 'Yummy English Website',
        }}
      />

      <CacheProvider value={emotionCache}>
        <ApolloProvider client={apolloClient}>
          <PermissionProvider>
            <ThemeProvider>
              <LoadingProvider>
                <ToastifyProvider>
                  <NotificationProvider>
                    <SidebarProvider>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <CssBaseline />
                        {/* <PageTransition
                          timeout={TIMEOUT}
                          classNames="page-transition"
                          loadingTimeout={{
                            enter: TIMEOUT,
                            exit: 500,
                          }}
                          loadingClassNames="loading-indicator"
                        >
                          {getLayout(<Component {...pageProps} />)}
                        </PageTransition> */}
                        <Box minHeight="100vh">{getLayout(<Component {...pageProps} />)}</Box>
                        { Boolean(Number(publicRuntimeConfig.ENABLE_CHATWOOT)) && <ChatwootWidget />}
                      </LocalizationProvider>
                    </SidebarProvider>
                  </NotificationProvider>
                  <style jsx global>{`
                    .page-transition-enter {
                      opacity: 0;
                      transform: translate3d(0, -10px, 0);
                    }
                    .page-transition-enter-active {
                      opacity: 1;
                      transform: translate3d(0, 0, 0);
                      transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
                    }
                    .page-transition-exit {
                      opacity: 1;
                    }
                    .page-transition-exit-active {
                      opacity: 0;
                      transition: opacity ${TIMEOUT}ms;
                    }
                    .loading-indicator-appear,
                    .loading-indicator-enter {
                      opacity: 0;
                    }
                    .loading-indicator-appear-active,
                    .loading-indicator-enter-active {
                      opacity: 1;
                      transition: opacity ${TIMEOUT}ms;
                    }
                  `}</style>
                </ToastifyProvider>
              </LoadingProvider>
            </ThemeProvider>
          </PermissionProvider>
        </ApolloProvider>
      </CacheProvider>
    </React.Fragment>
  );
}

export default CustomApp;


/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ReactElement, ReactNode, useState, useEffect } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Box } from '@mui/system';
import CssBaseline from '@mui/material/CssBaseline';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import 'nprogress/nprogress.css';
import './styles.scss';
import { ThemeProvider } from '@els/client-shared-theme';
import { createEmotionCache } from '@els/client/shared/utils';
import { useScrollTop } from '@els/client-shared-hooks';
import { ApolloClient } from '@els/client/shared/data-access';
import { i18n as internationalization } from '@els/client-shared-i18n';
import {
  PermissionProvider,
  SidebarProvider,
  ToastifyProvider,
} from '@els/client/app/shared/contexts';
import jsCookies from 'js-cookie';
import { ApolloProvider } from '@apollo/client';
import { NextSeo } from 'next-seo';
import { Loading } from '@els/client/app/shared/ui';
import { ChatwootWidget } from '@els/client/shared/components';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

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
  useScrollTop();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    internationalization.changeLanguage(jsCookies.get('i18nextLng') ?? localStorage.getItem('i18nextLng') ?? 'vi');
    window.onbeforeunload = () => setLoading(true);

    return () => (window.onbeforeunload = null);
  }, []);

  if (loading) return <Loading />;

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
            <ToastifyProvider>
              <SidebarProvider>
                <ThemeProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <CssBaseline />
                    <Box>{getLayout(<Component {...pageProps} />)}</Box>
                    {Boolean(Number(publicRuntimeConfig.ENABLE_CHATWOOT)) && <ChatwootWidget />}
                  </LocalizationProvider>
                </ThemeProvider>
              </SidebarProvider>
            </ToastifyProvider>
          </PermissionProvider>
        </ApolloProvider>
      </CacheProvider>
    </React.Fragment>
  );
}

export default CustomApp;


/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

import Sidebar from './sidebar';
import Header from './header';
import { Loading, ThemeSettings } from '@els/client/app/shared/ui';
import { useRouter } from 'next/router';

const MainWrapper = styled(Box)(
  ({ theme }) => `
    flex: 1 1 auto;
    display: flex;
    height: 100%;
    
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      padding-left: calc(${theme.sidebar.width} + 20px);
    }

    .footer-wrapper {
      margin: 0;
      background: transparent;
    }
  `
);

const MainContent = styled(Box)(
  () => `
    flex: 1 1 auto;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  `
);

const BodyContent = styled(Box)(
  ({ theme }) => `
    position: relative;
    width: 100%;
    height: 100%;
  `
);

interface BoxedSidebarLayoutProps {
  children?: ReactNode;
}

const BoxedSidebarLayout: FC<BoxedSidebarLayoutProps> = ({ children }) => {
  const TIMEOUT = 400;

  const router = useRouter();

  const theme = useTheme();

  const [loading, setLoading] = useState<boolean>(false);
  const loadingTimeoutRef = useRef<any>();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = setTimeout(() => setLoading(false), TIMEOUT);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });
  
  return (
    <>
      <Sidebar />
      <MainWrapper>
        <MainContent>
          <Header sx={{ zIndex: 2 }} />
          <BodyContent sx={{ zIndex: 1 }}>
            {children}
            {loading &&
              <Loading
                bgColor={theme.palette.background.default}
                sx={{
                  left: {
                    xs: 0,
                    lg: `calc(${theme.sidebar.width} + 20px)`,
                  },
                  width: {
                    xs: '100%',
                    lg: `calc(100% - ${theme.sidebar.width})`,
                  },
                }}
              />
            }
          </BodyContent>
          <ThemeSettings />
        </MainContent>
      </MainWrapper>
    </>
  );
};

BoxedSidebarLayout.propTypes = {
  children: PropTypes.node
};

export { BoxedSidebarLayout };

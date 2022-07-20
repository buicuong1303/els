import { useContext } from 'react';

import { Box, Drawer, styled, useTheme } from '@mui/material';

import SidebarMenu from './sidebar-menu';
import SidebarTopSection from './sidebar-top-section';
import { Scrollbar } from '@els/client/shared/components';
import { Logo } from '@els/client/app/shared/ui';
import { SidebarContext } from '@els/client/app/shared/contexts';
import { useRouter } from 'next/router';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
    width: ${theme.sidebar.width};
    min-width: ${theme.sidebar.width};
    color: ${theme.sidebar.textColor};
    background: ${theme.sidebar.background};
    box-shadow: ${theme.sidebar.boxShadow};
    position: relative;
    z-index: 7;
    height: 100%;
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      height: calc(100% - ${theme.header.height});
      margin-top: ${theme.header.height};
    }
  `
);

const TopSection = styled(Box)(
  ({ theme }) => `
    margin: ${theme.spacing(2)};
  `
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  const router = useRouter();

  return (
    <>
      <SidebarWrapper
        sx={{
          // display: { xs: 'none', lg: 'inline-block' },
          display: 'inline-block',
          position: 'fixed',
          left: 0,
          top: 0
        }}
      >
        <Scrollbar>
          <TopSection>
            <SidebarTopSection />
          </TopSection>
          <SidebarMenu />
        </Scrollbar>
      </SidebarWrapper>
      <Drawer
        sx={{
          boxShadow: `${theme.sidebar.boxShadow}`
        }}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper>
          <Scrollbar>
            <TopSection>
              <Box
                sx={{
                  cursor: 'pointer',
                  mb: 2,
                  p: 1,
                  // backgroundColor: theme.colors.primary.main,
                }}
                onClick={() => router.push('/home')}
              >
                <Logo sx={{ boxShadow: 'unset' }} />
              </Box>
              <SidebarTopSection />
            </TopSection>
            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;

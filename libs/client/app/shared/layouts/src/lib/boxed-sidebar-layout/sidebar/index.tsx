import { useContext } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { SidebarContext } from '@els/client/app/shared/contexts';
import { Logo } from '@els/client/app/shared/ui';

import { Box, Drawer, Hidden } from '@mui/material';

import { styled } from '@mui/material/styles';
import SidebarMenu from './sidebar-menu';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
    width: ${theme.sidebar.width};
    color: ${theme.sidebar.textColor};
    background: ${theme.sidebar.background};
    box-shadow: ${theme.sidebar.boxShadow};
    height: 100%;
    
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      position: fixed;
      height: calc(100% - 40px);
      margin: 20px 0px 20px 20px;
      z-index: 10;
      border-radius: ${theme.general.borderRadius};
    }
  `
);

const TopSection = styled(Box)(
  ({ theme }) => `
    display: flex;
    height: 90px;
    align-items: center;
    justify-content: center;
    margin: 0 0;
    border-bottom: ${theme.sidebar.dividerBg} solid 1px;
    background: ${theme.colors.primary.main};
    padding: ${theme.spacing(2, 4)};
    border-radius: ${theme.general.borderRadius} ${theme.general.borderRadius} 0 0;
  `
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();

  return (
    <>
      <Hidden lgDown>
        <SidebarWrapper>
          <TopSection>
            <Logo sx={{ boxShadow: 'unset' }} />
          </TopSection>
          <Box sx={{ height: 'calc(100% - 80px)' }}>
            <Scrollbars universal autoHide>
              <Box pt={1}>
                <SidebarMenu />
              </Box>
            </Scrollbars>
          </Box>
        </SidebarWrapper>
      </Hidden>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          open={sidebarToggle}
          onClose={closeSidebar}
          variant="temporary"
          elevation={9}
        >
          <SidebarWrapper>
            <Scrollbars universal autoHide>
              <TopSection
                sx={{
                  borderRadius: 0,
                }}
              >
                <Logo sx={{ boxShadow: 'unset' }} />
              </TopSection>
              <SidebarMenu />
            </Scrollbars>
          </SidebarWrapper>
        </Drawer>
      </Hidden>
    </>
  );
}

export default Sidebar;

import { useContext } from 'react';

import { Box, Hidden, IconButton, Tooltip, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from '@els/client/app/shared/contexts';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';

// import HeaderMenu from './menu';
import HeaderButtons from './buttons';
import HeaderUserbox from './userbox';
import { Logo } from '@els/client/app/shared/ui';
import { SxProps } from '@mui/system';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        // margin-top: ${theme.spacing(3)};
        color: ${theme.header.textColor};
        // padding: ${theme.spacing(0, 2)};
        position: relative;
        justify-content: space-between;
        width: 100%;
`
);

const TopSection = styled(Box)(
  ({ theme }) => `
        display: flex;
        // height: 80px;
        align-items: center;
        justify-content: center;
        margin: 0 0;
        border-bottom: ${theme.sidebar.dividerBg} solid 1px;
        background: ${theme.colors.primary.main};
        padding: ${theme.spacing(1)};
        border-radius: ${theme.general.borderRadius};
`
);

interface HeaderProps {
  sx?: SxProps;
}

function Header(props: HeaderProps) {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const theme = useTheme();

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        p: {
          xs: theme.spacing(1),
          sm: theme.spacing(2),
          md: theme.spacing(2),
          lg: theme.spacing(2),
        },
        pb: '0 !important',
        ...props.sx,
      }}
    >
      <Box display="flex" alignItems="center">
        <Hidden lgUp>
          <TopSection>
            <Logo sx={{ boxShadow: 'unset' }} />
          </TopSection>
        </Hidden>
        {/* <Hidden mdDown>
          <HeaderMenu />
        </Hidden> */}
      </Box>
      <Box display="flex" alignItems="center">
        <HeaderButtons />
        <HeaderUserbox />
        <Hidden lgUp>
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
            </IconButton>
          </Tooltip>
        </Hidden>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;

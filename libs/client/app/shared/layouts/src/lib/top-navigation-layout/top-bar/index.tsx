/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { FC, useContext } from 'react';

import {
  Box,
  Card,
  Tooltip,
  IconButton,
  Container,
  darken,
  Divider,
  alpha,
  styled,
  useTheme
} from '@mui/material';
import NavigationMenu from './navigation-menu';
import LanguageSwitcher from './language-switcher';
import Notifications from './notifications';
import Userbox from './userbox';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { SidebarContext } from '@els/client/app/shared/contexts';
import { Logo } from '@els/client/app/shared/ui';
import { useRouter } from 'next/router';
import HeaderStreaks from './streaks';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { SxProps } from '@mui/system';
import { MutationFunctionOptions } from '@apollo/client';
import FixedHeader from './fixed-header';

const TopBarWrapper = styled(Card)(
  ({ theme }) => `
    color: ${theme.header.textColor};
    // background: ${alpha(darken(theme.colors.primary.dark, 0.2), 0.95)};
    // backdrop-filter: blur(5px);
    margin: ${theme.spacing(0, 0, 5)};
    padding: ${theme.spacing(4, 0, 44)};

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      margin: ${theme.spacing(0, 8, 5)};
      padding: ${theme.spacing(4, 3, 44)};
    }
    display: flex;
    align-items: center;
    border-radius: 0;
    border-bottom-right-radius: 40px;
    border-bottom-left-radius: 40px;
    position: relative;
  `
);

const TopBarImage = styled(Box)(
  () => `
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // opacity: .7;
  `
);

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
  `
);

const IconButtonPrimary = styled(IconButton)(
  ({ theme }) => `
    display: flex;
    margin-left: ${theme.spacing(1)};
    border-radius: ${theme.general.borderRadiusLg};
    justify-content: center;
    font-size: ${theme.typography.pxToRem(13)};
    padding: 0;
    position: relative;
    color: ${theme.colors.alpha.trueWhite[50]};
    background-color: ${theme.colors.alpha.white[10]};

    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
      font-size: ${theme.typography.pxToRem(26)};
      color: ${theme.colors.alpha.trueWhite[50]};
    }

    &.Mui-active,
    &:hover {
      background-color: ${alpha(theme.colors.alpha.white[30], 0.2)};

      .MuiSvgIcon-root {
        color: ${theme.colors.alpha.trueWhite[100]};
      }
    }
  `
);


interface TopBarProps {
  currentUser?: GraphqlTypes.LearningTypes.User;
  notifications: GraphqlTypes.LearningTypes.NotificationData[];
  UpdateSettingApp: (options?: MutationFunctionOptions) => void;
  ReadNotifications: (options?: MutationFunctionOptions) => void;
  sx?: SxProps;
}

const TopBar: FC<TopBarProps> = (props) => {
  const { currentUser, notifications, UpdateSettingApp, ReadNotifications, sx } = props;

  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const theme = useTheme();

  const router = useRouter();

  return (
    <TopBarWrapper>
      <FixedHeader>
        <TopBarImage
          sx={{
            backgroundImage: theme.colors.gradients[3],
          }}
        />

        <Container
          sx={{
            position: 'relative',
          }}
          maxWidth="xl"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => router.push('/home')}>
              <Logo sx={{ boxShadow: 'unset' }} />
            </Box>

            <Box display="flex">
              <HeaderStreaks currentUser={currentUser} sx={{ ml: 1 }} />

              <Notifications notifications={notifications} ReadNotifications={ReadNotifications} sx={{ ml: 1 }} />

              <LanguageSwitcher currentUser={currentUser} UpdateSettingApp={UpdateSettingApp} sx={{ ml: 1 }} />

              <Userbox currentUser={currentUser} sx={{ ml: 1 }} />

              <Box component="span">
                <Tooltip arrow title="Toggle Menu">
                  <IconButtonPrimary
                    color="primary"
                    onClick={toggleSidebar}
                    sx={{
                      width: {
                        xs: theme.spacing(4.5),
                        sm: theme.spacing(5),
                        md: theme.spacing(6),
                      },
                      height: {
                        xs: theme.spacing(4.5),
                        sm: theme.spacing(5),
                        md: theme.spacing(6),
                      }
                    }}
                  >
                    {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
                  </IconButtonPrimary>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Container>
      </FixedHeader>

      <TopBarImage
        sx={{
          backgroundImage: theme.colors.gradients[3],
          ...sx,
        }}
      />

      <Container
        sx={{
          zIndex: 6
        }}
        maxWidth="xl"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => router.push('/home')}>
            <Logo sx={{ boxShadow: 'unset' }} />
            
            {/* <Box
              component="span"
              sx={{
                display: { xs: 'none', md: 'inline-flex' }
              }}
            >
              <Search />
            </Box> */}
          </Box>

          <Box display="flex">
            <HeaderStreaks currentUser={currentUser} sx={{ ml: 1 }} />

            <Notifications notifications={notifications} ReadNotifications={ReadNotifications} sx={{ ml: 1 }} />

            <LanguageSwitcher currentUser={currentUser} UpdateSettingApp={UpdateSettingApp} sx={{ ml: 1 }} />

            <Userbox currentUser={currentUser} sx={{ ml: 1 }} />

            <Box
              component="span"
              sx={{
                display: { md: 'none', xs: 'inline-flex' }
              }}
            >
              <Tooltip arrow title="Toggle Menu">
                <IconButtonPrimary
                  color="primary"
                  onClick={toggleSidebar}
                  sx={{
                    width: {
                      xs: theme.spacing(4.5),
                      sm: theme.spacing(5),
                      md: theme.spacing(6),
                    },
                    height: {
                      xs: theme.spacing(4.5),
                      sm: theme.spacing(5),
                      md: theme.spacing(6),
                    }
                  }}
                >
                  {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
                </IconButtonPrimary>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <DividerWrapper
          sx={{
            display: { xs: 'none', md: 'flex' },
            my: 5
          }}
        />

        <Box
          display="flex"
          alignItems="center"
          sx={{
            width: '100%',
            display: { xs: 'none', md: 'inline-block' }
          }}
        >
          <NavigationMenu currentUser={currentUser} />
        </Box>
      </Container>
    </TopBarWrapper>
  );
};

export default TopBar;

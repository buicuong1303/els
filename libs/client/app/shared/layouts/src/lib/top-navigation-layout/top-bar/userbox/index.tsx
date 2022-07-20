/* eslint-disable @typescript-eslint/no-empty-interface */
import { FC, useContext, useRef, useState } from 'react';
import { ConfigIcon, GroupUserIcon, LinePercent, Link, PersonalIcon, SignOutIcon } from '@els/client/app/shared/ui';
import { useRouter } from 'next/router';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  List,
  ListItem,
  Popover,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenOutlined from '@mui/icons-material/LockOpenOutlined';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import { ToastifyContext } from '@els/client/app/shared/contexts';
import { useLazyQuery, useMutation } from '@apollo/client';
import { logoutKratos, cross_kratos, ApolloClient } from '@els/client/shared/data-access';
import getConfig from 'next/config';
import { GraphqlMutations, GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
import { SxProps } from '@mui/system';

const { publicRuntimeConfig } = getConfig();

const UserBoxButton = styled(Button)(
  ({ theme }) => `
    padding: ${theme.spacing(0, 1)};
    color: ${theme.colors.alpha.trueWhite[50]};
    background-color: ${theme.colors.alpha.white[10]};
    border-radius: ${theme.general.borderRadiusLg};

    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
      font-size: ${theme.typography.pxToRem(24)};
      color: ${theme.colors.alpha.trueWhite[50]};
    }

    .MuiAvatar-root {
      border-radius: ${theme.general.borderRadiusLg};
      width: 34px;
      height: 34px;
    }

    &.Mui-active,
    &:hover {
      background-color: ${alpha(theme.colors.alpha.white[30], 0.2)};

      .MuiSvgIcon-root {
        color: ${theme.colors.alpha.trueWhite[100]};
      }
    }

    .MuiButton-label {
      justify-content: flex-start;
    }
  `
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(2)};
  `
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
    text-align: left;
    padding-left: ${theme.spacing(1)};
    flex: 1;
  `
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
    color: ${theme.palette.secondary.light};
  `
);

const UserBoxDescriptionMain = styled(Typography)(
  ({ theme }) => `
    color: ${theme.colors.alpha.trueWhite[50]};
  `
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.palette.secondary.main};
  `
);

const UserBoxLabelMain = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.alpha.trueWhite[100]};
  `
);

interface HeaderUserboxProps {
  currentUser?: GraphqlTypes.LearningTypes.User;
  sx?: SxProps;
}

const HeaderUserbox: FC<HeaderUserboxProps> = (props) => {
  const { currentUser, sx } = props;

  const router = useRouter();
  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  const apolloClient = ApolloClient.useApollo(props);

  const theme = useTheme();

  const ref = useRef<any>(null);

  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => setOpen(true);

  const handleClose = (): void => setOpen(false);

  const [DeleteDeviceGql] = useMutation(
    GraphqlMutations.LearningMutations.Device.DeleteDevice,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
    }
  );

  const [Logout] = useLazyQuery(
    GraphqlQueries.LearningQueries.Setting.Logout,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: async () => {
        const currentToken = localStorage.getItem('tokenDevice');

        if(currentToken) {
          DeleteDeviceGql({
            variables: {
              deleteDeviceInput: {
                token: currentToken,
              },
            },
          });
        }

        await logoutKratos(apolloClient, cross_kratos);
      },
      fetchPolicy: 'no-cache', // ? note: not important
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
    },
  );

  const handleLogout = (): void => {
    Logout();
  };

  if (!currentUser) return null;

  return (
    <Box sx={sx}>
      <UserBoxButton
        fullWidth
        color="secondary"
        ref={ref}
        onClick={handleOpen}
        sx={{
          minWidth: 'unset',
          height: {
            xs: theme.spacing(4.5),
            sm: theme.spacing(5),
            md: theme.spacing(6),
          }
        }}
      >
        <Avatar
          sx={{
            width: { xs: '32px !important', sm: '36px !important', md: '40px !important' },
            height: { xs: '32px !important', sm: '36px !important', md: '40px !important' },
          }}
          variant="rounded"
          alt={currentUser?.identity?.traits.firstName}
          src={currentUser?.identity?.traits.picture ?? ''}
        />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabelMain variant="body1" display="flex" justifyContent="space-between" alignItems="center" minWidth="120px">
              <Box sx={{ lineHeight: 1, fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }} >
                {currentUser?.identity?.traits?.middleName ? 
                  `${currentUser?.identity?.traits?.firstName} ${currentUser?.identity?.traits?.middleName} ${currentUser?.identity?.traits?.lastName}`
                  : `${currentUser?.identity?.traits?.firstName} ${currentUser?.identity?.traits?.lastName}`
                }
              </Box>
            </UserBoxLabelMain>
            <LinePercent
              variant="determinate"
              color="success"
              percent={(currentUser?.exp / currentUser?.nextLevelExp) * 100}
              height="4px"
              isShowText={false}
              backgroundPercent={'#ffffff4d'}
              sx={{ p: 0, my: '4px' }}
            />
            <UserBoxDescriptionMain variant="body2" display="flex" justifyContent="space-between" alignItems="end">
              <Typography
                variant="subtitle1" children={`${t('Level')} ${currentUser?.level}`}
                sx={{ whiteSpace: 'nowrap', color: '#ffffff', lineHeight: 1, fontSize: '10px', fontWeight: 500 }}
              />
              <Box display="flex" alignItems="end">
                <Typography
                  variant="subtitle1" children={`${currentUser?.exp} ${t('exp')}`}
                  sx={{ whiteSpace: 'nowrap', color: '#ffffff', lineHeight: 1, fontSize: '10px', fontWeight: 400 }}
                />
              </Box>
            </UserBoxDescriptionMain>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ top: '8px' }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex" alignItems="center" justifyContent="center">
          <Avatar
            sx={{ width: '40px !important', height: '40px !important' }}
            variant="rounded"
            alt={currentUser?.identity?.traits.firstName}
            src={currentUser?.identity?.traits.picture ?? ''}
          />
          <UserBoxText>
            <UserBoxLabel variant="body1" display="flex" justifyContent="space-between" alignItems="center" minWidth="120px">
              <Box sx={{ lineHeight: 1, fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }} >{`${currentUser?.identity?.traits?.firstName} ${currentUser?.identity?.traits?.lastName}`}</Box>
            </UserBoxLabel>
            <LinePercent
              variant="determinate"
              color="success"
              percent={(currentUser?.exp / currentUser?.nextLevelExp) * 100}
              height="4px"
              isShowText={false}
              backgroundPercent={'#cccccc'}
              sx={{ p: 0, my: '4px' }}
            />
            <UserBoxDescription variant="body2" display="flex" justifyContent="space-between" alignItems="end">
              <Typography
                variant="subtitle1" children={`${t('Level')} ${currentUser?.level}`}
                sx={{ whiteSpace: 'nowrap', lineHeight: 1, fontSize: '10px', fontWeight: 500 }}
              />
              <Box display="flex" alignItems="end">
                <Typography
                  variant="subtitle1" children={`${currentUser?.exp} ${t('exp')}`}
                  sx={{ whiteSpace: 'nowrap', lineHeight: 1, fontSize: '10px', fontWeight: 400 }}
                />
              </Box>
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem
            onClick={() => handleClose()}
            button
            href="/"
            component={Link}
            sx={{
              fontSize: '16px', fontWeight: 400, color: theme.colors.secondary.dark
            }}
          >
            <PersonalIcon color={theme.colors.secondary.dark}/>
            {t('Personal')}
          </ListItem>
          <ListItem
            onClick={() => handleClose()}
            button
            href="/settings"
            component={Link}
            sx={{
              fontSize: '16px', fontWeight: 400, color: theme.colors.secondary.dark
            }}
          >
            <ConfigIcon color={theme.colors.secondary.dark} />
            {t('Settings')}
          </ListItem>
          <ListItem
            onClick={() => handleClose()}
            button
            href="/referral"
            component={Link}
            sx={{
              fontSize: '16px', fontWeight: 400, color: theme.colors.secondary.dark
            }}
          >
            <GroupUserIcon color={theme.colors.secondary.dark} />
            {t('Refer friends')}
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          {currentUser ? (
            <Button
              color="error"
              fullWidth
              onClick={handleLogout}
              sx={{
                justifyContent: 'start',
                textAlign: 'left',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              <SignOutIcon />
              {t('Sign out')}
            </Button>
          ) : (
            <Button
              color="success"
              fullWidth
              onClick={() =>
                router.push(`${publicRuntimeConfig.GUARDIAN_URL}/login`)
              }
              sx={{
                justifyContent: 'start',
                textAlign: 'left',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              <LockOpenOutlined />
              {t('Sign in')}
            </Button>
          )}
        </Box>
        <Box sx={{ m: 1 }}>
          {!currentUser && (
            <Button
              color="primary"
              fullWidth
              onClick={() =>
                router.push(`${publicRuntimeConfig.GUARDIAN_URL}/registration`)
              }
              sx={{
                justifyContent: 'start',
                textAlign: 'left',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              <AccountCircleOutlined />
              {t('Register')}
            </Button>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default HeaderUserbox;

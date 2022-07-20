
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';

import {
  alpha,
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Popover,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone';
import { ToastifyContext } from '@els/client/app/shared/contexts';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  ApolloClient,
  cross_kratos,
} from '@els/client/shared/data-access';
import getConfig from 'next/config';
import { GraphqlMutations, GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
import { ConfigIcon, GroupUserIcon, LinePercent, Link, PersonalIcon, SignOutIcon } from '@els/client/app/shared/ui';
import LockOpenOutlined from '@mui/icons-material/LockOpenOutlined';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import { useRouter } from 'next/router';

const { publicRuntimeConfig } = getConfig();

const UserBoxButton = styled(Button)(
  ({ theme }) => `
    padding: ${theme.spacing(1)};
    background-color: ${alpha(theme.colors.alpha.black[100], 0.08)};

    .MuiButton-label {
      justify-content: flex-start;
    }

    &:hover {
      background-color: ${alpha(theme.colors.alpha.black[100], 0.12)};
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

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.sidebar.menuItemColor};

    &.popoverTypo {
      color: ${theme.palette.secondary.main};
    }
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
    color: ${alpha(theme.sidebar.menuItemColor ?? '', 0.6)};

    &.popoverTypo {
      color: ${theme.palette.secondary.light};
    }
  `
);

interface SidebarTopSectionProps {}

const SidebarTopSection: FC<SidebarTopSectionProps> = (props) => {
  const { t }: { t: any } = useTranslation();
  
  const { toastify } = useContext(ToastifyContext);
  
  const apolloClient = ApolloClient.useApollo(props);

  const theme = useTheme();

  const router = useRouter();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [logoutToken, setLogoutToken] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();

  const handleOpen = (): void => setOpen(true);

  const handleClose = (): void => setOpen(false);

  const [DeleteDeviceGql] = useMutation(
    GraphqlMutations.LearningMutations.Device.DeleteDevice,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      // onCompleted: (data) => {
      //   console.log(data);
      // },
      onError: (error) => {
        // console.log({ ...error });
        toastify({
          message: error.message,
          type: 'error',
        });
      },
    }
  );

  const [GetCurrentUser, { data: getCurrentUserData }] = useLazyQuery<{
    user: GraphqlTypes.LearningTypes.User;
  }>(GraphqlQueries.LearningQueries.User.GetUser, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      if (data?.user) setCurrentUser(data?.user);
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
  });

  const handleLogout = (): void => {
    // handleClose();
    const currentToken = localStorage.getItem('tokenDevice');

    currentToken &&
      DeleteDeviceGql({
        variables: {
          deleteDeviceInput: {
            token: currentToken,
          },
        },
        // onCompleted: (data) => {},
      });
    localStorage.removeItem('tokenDevice');
    document.cookie = 'return_to_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    cross_kratos
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        setLogoutToken(data.logout_token);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      });

    apolloClient.cache.reset();
  };

  useEffect(() => {
    if (logoutToken) {
      cross_kratos
        .submitSelfServiceLogoutFlow(logoutToken)
        .then(
          () =>
            (window.location.href = `${publicRuntimeConfig.GUARDIAN_URL}/login`)
        );
    }
  }, [logoutToken]);

  useEffect(() => {
    GetCurrentUser();
  }, [router]);

  useEffect(() => {
    if (getCurrentUserData)
      setCurrentUser(getCurrentUserData.user);
  }, []);

  if (!currentUser) return null;

  return (
    <>
      <UserBoxButton fullWidth color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar
          variant="rounded"
          alt={currentUser?.identity?.traits.firstName}
          src={currentUser?.identity?.traits.picture ?? ''}
        />
        <Box display="flex" flex={1} alignItems="center" justifyContent="space-between">
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
          <UnfoldMoreTwoToneIcon
            fontSize="small"
            sx={{
              ml: 1
            }}
          />
        </Box>
      </UserBoxButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
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
      {/* <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210
          }}
          display="flex" alignItems="center" justifyContent="space-between"
        >
          <Avatar
            variant="rounded"
            alt={currentUser?.identity?.traits.firstName}
            src={currentUser?.identity?.traits.picture}
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
                  variant="subtitle1" children={`${currentUser?.exp} ${t('exp to')}`}
                  sx={{ whiteSpace: 'nowrap', lineHeight: 1, fontSize: '10px', fontWeight: 400 }}
                />
              </Box>
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider
          sx={{
            mb: 0
          }}
        />
        <List
          sx={{
            p: 1
          }}
          component="nav"
        >
          <ListItem
            onClick={() => {
              handleClose();
            }}
            button
          >
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Profile')} />
          </ListItem>
          <ListItem
            onClick={() => {
              handleClose();
            }}
            button
          >
            <InboxTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Inbox')} />
          </ListItem>
          <ListItem
            onClick={() => {
              handleClose();
            }}
            button
          >
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Projects')} />
          </ListItem>
        </List>
        <Divider />
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1
              }}
            />
            {t('Sign out')}
          </Button>
        </Box>
      </Popover> */}
    </>
  );
};

export default SidebarTopSection;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { Link } from '@els/client/app/shared/ui';
import { useRouter } from 'next/router';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { ToastifyContext } from '@els/client/app/shared/contexts';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ApolloClient, cross_kratos } from '@els/client/shared/data-access';
import { cloneDeep } from 'lodash';
import getConfig from 'next/config';
import { GraphqlMutations, GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
const { publicRuntimeConfig } = getConfig();

const UserBoxButton = styled(Button)(
  ({ theme }) => `
    padding: ${theme.spacing(0, 0.5)};
    height: ${theme.spacing(6)};
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
  `
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.palette.secondary.main};
    display: block;
  `
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
    color: ${theme.palette.secondary.light}
  `
);

interface HeaderUserboxProps {}

const HeaderUserbox: FC<HeaderUserboxProps> = (props) => {
  const router = useRouter();
  const [logoutToken, setLogoutToken] = useState<string>('');
  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();
  const [warned, setWarned] = useState<boolean>(false);

  const handleOpen = (): void => setOpen(true);

  const handleClose = (): void => setOpen(false);

  const [DeleteDeviceGql] = useMutation(GraphqlMutations.LearningMutations.Device.DeleteDevice, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      // console.log({ ...error });
      toastify({
        message: error.message,
        type: 'error',
      });
    },
  });

  const [GetCurrentUser, { data: getCurrentUserData }] = useLazyQuery<{
    user: GraphqlTypes.LearningTypes.User;
  }>(GraphqlQueries.LearningQueries.User.GetUser, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      if (data?.user) setCurrentUser(data?.user);

      const verified =
        cloneDeep(data?.user.identity?.verifiableAddresses ?? [])?.findIndex(
          (item) => item.verified
        ) !== -1;

      if (!verified)
        if (!warned) {
          setWarned(true);
          toastify({
            message: t('Please verify your account to use more features'),
            type: 'warning',
            autoClose: false,
          });
        }
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
    currentToken && DeleteDeviceGql({
      variables: {
        deleteDeviceInput: {
          token: currentToken,
        },
      },
      onCompleted: (data) => {
        // console.log(data);
      },
    });
    cross_kratos
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        console.log(logoutToken);
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
  };

  useEffect(() => {
    if (logoutToken) {
      cross_kratos
        .submitSelfServiceLogoutFlow(logoutToken)
        .then(() => window.location.href = `${publicRuntimeConfig.GUARDIAN_URL}/login` );
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
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar
          variant="rounded"
          alt={currentUser?.identity?.traits?.firstName}
          src={currentUser?.identity?.traits?.picture ?? ''}
        />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{`${currentUser?.identity?.traits?.firstName} ${currentUser?.identity?.traits?.lastName}`}</UserBoxLabel>
            <UserBoxDescription variant="body2">Developer</UserBoxDescription>
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
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar
            variant="rounded"
            alt="Margaret Gale"
            src="/images/avatars/3.jpg"
          />
          <UserBoxText>
            <UserBoxLabel variant="body1">{`${currentUser?.identity?.traits?.firstName} ${currentUser?.identity?.traits?.lastName}`}</UserBoxLabel>
            <UserBoxDescription variant="body2">Developer</UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem
            onClick={() => {
              handleClose();
            }}
            button
            href="/management/users/1"
            component={Link}
          >
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Profile')} />
          </ListItem>
          <ListItem
            onClick={() => {
              handleClose();
            }}
            button
            href="/applications/projects-board"
            component={Link}
          >
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Projects')} />
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          {currentUser ? (
            <Button
              color="error"
              fullWidth
              onClick={handleLogout}
              sx={{ justifyContent: 'start' }}
            >
              <LockOutlinedIcon sx={{ width: '34px' }} />
              {t('Sign out')}
            </Button>
          ) : (
            <Button
              color="success"
              fullWidth
              onClick={() => router.push(`${publicRuntimeConfig.GUARDIAN_URL}/login`)}
              sx={{ justifyContent: 'start' }}
            >
              <LockOpenOutlinedIcon sx={{ width: '34px' }} />
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
              sx={{ justifyContent: 'start' }}
            >
              <AccountCircleOutlinedIcon sx={{ width: '34px' }} />
              {t('Register')}
            </Button>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default HeaderUserbox;

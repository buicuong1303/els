/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { FC, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Drawer,
  alpha,
  Card,
  Container,
  styled,
  useTheme,
  Tooltip,
  Fab,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';

import { SidebarContext, ToastifyContext } from '@els/client/app/shared/contexts';

import TopBar from './top-bar';
import { Scrollbar } from '@els/client/shared/components';
import SidebarMenu from './sidebar/sidebar-menu';
import SidebarTopSection from './sidebar/sidebar-top-section';
import { HandIcon, Logo, StartRatingCongratulationIcon, StreakCongratulationIcon } from '@els/client/app/shared/ui';
import Footer from './footer';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ApolloClient } from '@els/client/shared/data-access';
import { GraphqlMutations, GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
import { QuickTestPage } from '@els/client/app/quick-test/feature';
import { useTranslation } from 'react-i18next';
import { QuickTestData, TestPage } from '@els/client/app/topic/ui';
import { cloneDeep, orderBy } from 'lodash';
import { useSubscription } from '@apollo/client';
import { GraphqlSubscriptions } from '@els/client/app/shared/data-access';
// import { PreconditionFailedException } from '@nestjs/common';
import { CongratulationCard } from '@els/client/app/mission/ui';
import { addAlpha } from '@els/client/shared/utils';

interface TopNavigationLayoutProps {
  children?: ReactNode;
}

const ActionFixed = styled(Box)(
  ({ theme }) => `
    position: fixed;
    z-index: 9999;
    right: ${theme.spacing(2.5)};
    top: 50%;
    transform: translate(0, -50%);
  `
);

const MainWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(0, 0, 5)};
    background-color: #ffffff;
    min-height: 100vh;

    .MuiDrawer-fm .MuiPaper-root {
      top: 0;
      height: 100%;
    }

    .Mui-FixedWrapper .MuiPaper-root {
      top: 0;
      left: 0;
    }
    .MuiDrawer-hd .MuiPaper-root {
      top: 0;
      height: 100%;
    }

    .footer-wrapper {
      box-shadow: 0px 0px 2px ${theme.colors.alpha.black[30]};
    }
  `
);

const MainContent = styled(Container)(
  ({ theme }) => `
    margin-top: ${theme.spacing(-45)};
    position: relative;
    z-index: 55;
    padding-left: ${theme.spacing(1)} !important;
    padding-right: ${theme.spacing(1)} !important;
  `
);

const CardWrapper = styled(Card)(
  ({ theme }) => `
    min-height: calc(100vh - ${theme.spacing(45)});
    backdrop-filter: blur(5px);
    border-radius: ${theme.general.borderRadiusXl};
    background: ${alpha(theme.colors.alpha.white[100], 0.9)};
  `
);

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
    width: ${theme.sidebar.width};
    min-width: ${theme.sidebar.width};
    color: ${theme.sidebar.textColor};
    background: ${theme.sidebar.background};
    box-shadow: ${theme.sidebar.boxShadow};
    position: relative;
    z-index: 5;
    height: 100%;
    // @media (min-width: ${theme.breakpoints.values.lg}px) {
    //   height: calc(100vh - ${theme.header.height});
    //   margin-top: ${theme.header.height};
    // };
    // @media (min-width: ${theme.breakpoints.values.md}px) {
    //   height: calc(100vh - ${theme.header.height});
    //   margin-top: ${theme.header.height};
    // };
  `
);

const TopSection = styled(Box)(
  ({ theme }) => `
    margin: ${theme.spacing(2, 2)};
  `
);

const TopNavigationLayout: FC<TopNavigationLayoutProps> = ({ children }) => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  const router = useRouter();

  const { t }: { t: any } = useTranslation();

  const { toastify } = useContext(ToastifyContext);

  // * page ref
  const currentUserRef = useRef<any>();

  // * page state
  const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();
  const [openQuickTest, setOpenQuickTest] = useState<boolean>(false);
  const [quickTestLoading, setQuickTestLoading] = useState<boolean>(false);
  const [openTestPage, setOpenTestPage] = useState<boolean>(false);
  const [warned, setWarned] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<GraphqlTypes.LearningTypes.NotificationData[]>([]);

  const [quickTestData, setQuickTestData] = useState<QuickTestData>({ equipments: [], numberOfQuestions: 10, topicIds: [] });

  const quickTestDataMemo = useMemo(() => quickTestData, [quickTestData]);

  // * congratulation
  interface CongratulationCardValueType {
    open: boolean,
    icon?: any,
    title?: ReactNode,
    message?: ReactNode,
  };

  const initCongratulationValue: CongratulationCardValueType = {
    open: false,
    icon: '',
    title: '',
    message: '',
  };

  // * congratulation level
  const [congratulationLevelCardValue, setCongratulationLevelCardValue] = useState<CongratulationCardValueType>(initCongratulationValue);
  const handleOpenCongratulationLevelCard = (
    data: {
      icon: ReactNode,
      title: ReactNode,
      message?: ReactNode,
    }
  ) => {
    setCongratulationLevelCardValue({
      open: true,
      icon: data.icon,
      title: data.title,
      message: data.message,
    });
  };
  const handleCloseCongratulationLevelCard = () => {
    setCongratulationLevelCardValue(initCongratulationValue);
  };

  // * congratulation streak
  const [congratulationStreakCardValue, setCongratulationStreakCardValue] = useState<CongratulationCardValueType>(initCongratulationValue);
  const handleOpenCongratulationStreakCard = (
    data: {
      icon: ReactNode,
      title: ReactNode,
      message?: ReactNode,
    }
  ) => {
    setCongratulationStreakCardValue({
      open: true,
      icon: data.icon,
      title: data.title,
      message: data.message,
    });
  };
  const handleCloseCongratulationStreakCard = () => {
    setCongratulationStreakCardValue(initCongratulationValue);
  };

  // * load data
  const [GetCurrentUser, { subscribeToMore: subscriptionGetCurrentUser }] = useLazyQuery<{ user: GraphqlTypes.LearningTypes.User }>(
    GraphqlQueries.LearningQueries.User.GetUser,
    {
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
    }
  );

  const [UpdateSettingApp] = useMutation<{
    settings: {
      updateApplication: GraphqlTypes.LearningTypes.Setting,
    }
  }>(GraphqlMutations.LearningMutations.Setting.UpdateSettingApp, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onCompleted: (data) => {
      toastify({
        message: t('Display language has been updated successfully'),
        type: 'success',
      });
    },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    refetchQueries: [
      GraphqlQueries.LearningQueries.User.GetUser,
    ],
  });

  const [ReadNotifications] = useMutation<{
    notification: {
      read: string,
    }
  }>(GraphqlMutations.LearningMutations.Notification.ReadNotifications, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onError: (error) => {
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    fetchPolicy: 'no-cache',
  });

  const [GetNotifications] = useLazyQuery<{ notifications: GraphqlTypes.LearningTypes.NotificationData[] }>(
    GraphqlQueries.LearningQueries.Notification.GetNotifications,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        setNotifications(orderBy(data.notifications, (notification) => notification.createdAt, 'desc') ?? []);
      },
      onError: (error) => {
        toastify({
          message: error.message,
          type: 'error',
        });
      },
    }
  );

  useSubscription(
    GraphqlSubscriptions.LearningMutations.Mission.SubscriptionMissionCompleted,
    {
      onSubscriptionData: ({ client, subscriptionData }) => {
        if (subscriptionData?.data) {
          // ? note: If the data returned from Subscription is too complicated, reload data
          GetCurrentUser({ fetchPolicy: 'network-only' });
        }
      },
    }
  );

  useSubscription(
    GraphqlSubscriptions.LearningMutations.User.SubscriptionExpUp,
    {
      onSubscriptionData: ({ client, subscriptionData }) => {
        if (subscriptionData?.data) {
          // ? note: If the data returned from the Subscription is simple you can use client.cache.modify to override cache
          client.cache.modify({
            id: client.cache.identify({
              __typename: 'User',
              id: subscriptionData?.data?.expUp?.idSubscription,
            }),
            fields: {
              level: (currentLevel: number) => {
                if (subscriptionData?.data?.expUp?.level > currentLevel) {
                  handleOpenCongratulationLevelCard({
                    icon:
                      <StartRatingCongratulationIcon
                        color={theme.colors.info.main}
                        sx={{
                          position: 'relative',
                          width: '100%',
                          maxWidth: { xs: '40px', sm: '56px', md: '64px', lg: '72px' },
                          height: '100%',
                          maxHeight: { xs: '40px', sm: '56px', md: '64px', lg: '72px' },
                          left: '50%', 
                          transform: 'translate(-50%, 0%)'
                        }}
                      />,
                    title: `${t('Congratulations on reaching level')} ${subscriptionData?.data?.expUp?.level}`,
                  });
                }
  
                return subscriptionData?.data?.expUp?.level;
              },
              exp: () => subscriptionData?.data?.expUp?.exp,
              expDate: () => subscriptionData?.data?.expUp?.expDate,
              nextLevelExp: () => subscriptionData?.data?.expUp?.nextLevelExp,
            },
          });
        }
      }
    }
  );

  useSubscription(
    GraphqlSubscriptions.LearningMutations.Streak.SubscriptionStreakCreated,
    {
      onSubscriptionData: ({ client, subscriptionData }) => {
        if (subscriptionData?.data) {
          GetCurrentUser({ fetchPolicy: 'network-only' });
  
          // ? note: use client.readQuery to get the prev
          const cacheCurrentUser = client.readQuery({
            query: GraphqlQueries.LearningQueries.User.GetUser,
          });
  
          handleOpenCongratulationStreakCard({
            icon:
              <StreakCongratulationIcon
                color={theme.colors.info.main}
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: { xs: '40px', sm: '56px', md: '64px', lg: '72px' },
                  height: '100%',
                  maxHeight: { xs: '40px', sm: '56px', md: '64px', lg: '72px' },
                  left: '50%',
                  transform: 'translate(-50%, 0%)'
                }}
              />,
            title: t('Congratulations on completing your target today'),
            message:
              <Box textAlign="center" mt={{ xs: 2, md: 3 }}>
                <Typography
                  variant="inherit"
                  children={(cacheCurrentUser?.extraInfo?.currentStreakList?.streaks?.length ?? 0) + 1}
                  sx={{
                    color: theme.colors.info.main,
                    fontSize: { xs: '30px', md: '40px' },
                    fontWeight: 700
                  }}
                />

                <Typography
                  variant="inherit"
                  children={t('Current streak date')}
                  sx={{
                    mt: 0.5,
                    color: theme.colors.info.main,
                    fontSize: { xs: '20px', md: '24px' },
                    fontWeight: 400
                  }}
                />
              </Box>,
          });
        }
      }
    }
  );

  // handle logic
  const handleTest = () => setOpenTestPage(true);

  // * useEffect
  useEffect(() => {
    GetCurrentUser();
  }, [router, GetCurrentUser]);

  useEffect(() => {
    GetNotifications();
  }, [GetNotifications]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // useEffect(() => console.log(currentUser), [currentUser]);

  return (
    <MainWrapper>
      <TopBar currentUser={currentUser} notifications={notifications} UpdateSettingApp={UpdateSettingApp} ReadNotifications={ReadNotifications} />

      <MainContent maxWidth="xl">
        <Box
          sx={{
            mx: {
              xs: 2,
              sm: 4,
              md: 8,
            }
          }}
        >
          <CardWrapper sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box flex="1" display="flex" flexDirection="column" sx={{ backgroundColor: theme.palette.background.default }}>
              {children}
            </Box>

            <Footer />
          </CardWrapper>
        </Box>

        <Drawer
          sx={{
            // display: { lg: 'none', xs: 'inline-block' }
            display: 'inline-block',
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

              <SidebarMenu currentUser={currentUser} />
            </Scrollbar>
          </SidebarWrapper>
        </Drawer>

        <ActionFixed>
          {/* quick test */}
          <Box>
            <Tooltip arrow placement="top" title={t('Quick test')} >
              <Fab
                onClick={() => setOpenQuickTest(true)}
                color="primary"
                aria-label="add"
                sx={{
                  width: '64px',
                  height: '64px',
                  boxShadow: `0 8px 24px ${addAlpha(theme.colors.primary.light, 0.3)} !important`,
                  '&:hover': {
                    boxShadow: `0 8px 32px ${addAlpha(theme.colors.primary.light, 0.6)} !important`,
                  }
                }}
              >
                <HandIcon width="30px" height="30px" />
              </Fab>
            </Tooltip>
          </Box>

          {/* theme setting */}
          {/* <Box mt={2}>
            <ThemeSettings />
          </Box> */}
        </ActionFixed>

        {openQuickTest && (
          <QuickTestPage
            open={openQuickTest}
            setOpen={setOpenQuickTest}
            handleTest={handleTest}
            setQuickTestData={setQuickTestData}
            quickTestLoading={quickTestLoading}
            quickTestDataMemo={quickTestDataMemo}
          />
        )}

        {openTestPage && (
          <TestPage
            open={openTestPage}
            setOpen={setOpenTestPage}
            title={t('Quick test')}
            isQuickTest={true}
            setOpenQuickTest={setOpenQuickTest}
            setQuickTestLoading={setQuickTestLoading}
            quickTestData={quickTestDataMemo}
            sx={{}}
          />
        )}
      </MainContent>

      <CongratulationCard
        open={congratulationLevelCardValue.open}
        onClose={handleCloseCongratulationLevelCard}
        icon={congratulationLevelCardValue.icon}
        title={congratulationLevelCardValue.title}
        message={congratulationLevelCardValue.message}
        rest={{
          className: congratulationLevelCardValue.open && 'animation-heaving'
        }}
      />

      <CongratulationCard
        open={congratulationStreakCardValue.open}
        onClose={handleCloseCongratulationStreakCard}
        icon={congratulationStreakCardValue.icon}
        title={congratulationStreakCardValue.title}
        message={congratulationStreakCardValue.message}
        rest={{
          className: congratulationStreakCardValue.open && 'animation-heaving'
        }}
      />
    </MainWrapper>
  );
};

TopNavigationLayout.propTypes = {
  children: PropTypes.node
};

export { TopNavigationLayout };

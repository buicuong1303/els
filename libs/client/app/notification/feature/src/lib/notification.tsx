
/* eslint-disable @typescript-eslint/no-empty-interface */
import { useLazyQuery, useMutation } from '@apollo/client';
import { ToastifyContext } from '@els/client/app/shared/contexts';
import { GraphqlMutations, GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
import { BreadcrumbsCustom, ButtonCustom, CommentIcon, LearningIcon, LogoIcon, NotificationIcon } from '@els/client/app/shared/ui';
import { ApolloClient } from '@els/client/shared/data-access';
import { fromNow } from '@els/client/shared/utils';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';
import jsCookies from 'js-cookie';
import { cloneDeep, orderBy } from 'lodash';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NotificationWrapper = styled(Box)(
  ({ theme }) => `
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

const BoxWrapper = styled(Box)(
  ({ theme }) => `
    height: 0;
    flex: 100%;
    display: flex;
    flex-direction: column;
  `
);

export interface NotificationProps {}

export const Notification: FC<NotificationProps> = (props) => {
  const theme = useTheme();
  
  const { t }: { t: any } = useTranslation();

  const language = jsCookies.get('i18nextLng') ?? window?.localStorage?.getItem('i18nextLng') ?? 'vi';

  const { toastify } = useContext(ToastifyContext);

  // * page state
  const [notifications, setNotifications] = useState<GraphqlTypes.LearningTypes.NotificationData[]>([]);
  
  // * load data
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

  const [ReadNotifications] = useMutation(GraphqlMutations.LearningMutations.Notification.ReadNotifications, {
    context: { serviceName: ApolloClient.ServiceName.Browser },
    onError: (error) => {
      console.log({...error});
      toastify({
        message: error.message,
        type: 'error',
      });
    },
    fetchPolicy: 'no-cache',
  });
  
  // * handle logic

  // * useEffect
  useEffect(() => {
    GetNotifications();
  }, []);

  useEffect(() => {
    const unreadNotifications = cloneDeep(notifications).filter(item => item.status === 'unread');
    if (unreadNotifications?.length) {
      ReadNotifications({
        variables: {
          readNotificationInput: {
            ids: unreadNotifications.map(item => item.id),
          },
        },
        update: (cache, result, { variables }) => {
          const notificationIds = variables?.readNotificationInput?.ids ?? [];

          if (notificationIds?.length) {
            notificationIds.forEach((item: string) => {
              cache.modify({
                id: cache.identify({
                  __typename: 'NotificationData',
                  id: item,
                }),
                fields: {
                  status: () => 'read'
                },
              });
            });
          }
        }
      });
    }
  }, [notifications]);

  // if (false) return <Loading />;

  // * render ui
  return (
    <NotificationWrapper
      sx={{
        height: {
          xs: 'unset',
        },
        padding: {
          xs: theme.spacing(1),
          sm: theme.spacing(2),
          md: theme.spacing(3),
          lg: theme.spacing(5),
        },
      }}
    >
      {/* title page */}
      <BreadcrumbsCustom
        title={t('Notifications')}
        breadcrumbsList={[]}
        icon={<NotificationIcon width="36px" height="36px" color="unset" />}
      />

      {/* content */}
      <BoxWrapper sx={{ minHeight: '100%' }}>
        <Box
          sx={{
            bgcolor: theme.colors.alpha.white[100],
            boxShadow: theme.colors.shadows.card,
            borderRadius: '6px',
            p: 5,
            minHeight: '100%',
            flex: 1,
          }}
        >
          {notifications.map((item, index) => {
            let link: string | undefined = undefined;

            const options: HTMLReactParserOptions = {
              replace: (domNode: any) => {
                if (domNode.name === 'a') {
                  link = domNode?.attribs?.href;
                  return (
                    <a
                      style={{ color: theme.colors.secondary.light, fontWeight: 400, fontSize: '16px' }}
                    >
                      {domToReact(domNode.children, options)}
                    </a>
                  );
                }

                if (domNode.name === 'b') {
                  return (
                    <a
                      {...link && { href: link }}
                      style={{ color: theme.colors.primary.main, fontWeight: 600, fontSize: '16px', textDecoration: 'unset' }}
                    >
                      {domToReact(domNode.children, options)}
                    </a>
                  );
                }
              }
            };

            return (
              <Box
                key={item?.id ?? index}
                sx={{
                  border: `1px solid ${theme.palette.grey[50]}`,
                  borderRadius: '6px',
                  py: '12px',
                  px: { xs: '12px', md: '24px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...(index !== 0) && { mt: '12px' },
                }}
              >
                {/* group content */}
                <Box display="flex" alignItems="center">
                  {/* logo */}
                  <ButtonCustom
                    startIcon={<LogoIcon />}
                    sx={{
                      p: 0,
                      pointerEvents: 'none',
                      minWidth: 'unset',
                      mr: { xs: '12px', md: '20px' },
                    }}
                  />

                  {/* content */}
                  <Box flex={1}>
                    {/* title */}
                    <Typography
                      variant="inherit"
                      children={t(item.actor)}
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                      }}
                    />

                    {/* description */}
                    <Typography
                      variant="inherit"
                      children={parse(item.message, options)}
                    />
                  </Box>
                </Box>

                {/* group action */}
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'end', md: 'start' }}>
                  {/* time */}
                  <Typography
                    variant="inherit"
                    children={fromNow({ time: item.createdAt, language: language })}
                    sx={{
                      color: theme.colors.common.grey,
                      fontSize: '16px',
                      fontWeight: 400,
                      textAlign: 'right',
                      minWidth: '140px',
                    }}
                  />

                  {/* icon */}
                  <ButtonCustom
                    startIcon={
                      <>
                        {item.code === 'review-request' && <LearningIcon width="40px" height="40px" />}
                        {item.code === 'congratulate-completing' && <CommentIcon width="40px" height="40px" />}
                        {item.code === 'welcome' && <LearningIcon width="40px" height="40px" />}
                      </>
                    }
                    onClick={() => window.location.href = item.link}
                    sx={{
                      p: 0,
                      minWidth: 'unset',
                      ml: { xs: '12px', md: '20px' },
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </BoxWrapper>
    </NotificationWrapper>
  );
};

export default Notification;

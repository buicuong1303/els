/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  alpha,
  Badge,
  Box,
  Divider,
  IconButton,
  Popover,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { FC, useRef, useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/system';
import { ButtonCustom, CommentIcon, LearningIcon, LogoIcon, NotificationIcon } from '@els/client/app/shared/ui';
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { cloneDeep } from 'lodash';
import { fromNow } from '@els/client/shared/utils';
import jsCookies from 'js-cookie';
import { useRouter } from 'next/router';
import { MutationFunctionOptions } from '@apollo/client';

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    .MuiBadge-badge {
      background-color: ${alpha(theme.palette.success.main, 0.9)};
      color: ${theme.palette.success.contrastText};
      min-width: 18px; 
      height: 18px;
      padding: 0;

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 0 0 1px ${alpha(theme.palette.success.main, 0.3)};
        content: "";
      }
    }
  `
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    display: flex;
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

interface HeaderNotificationsProps {
  sx?: SxProps;
  notifications: GraphqlTypes.LearningTypes.NotificationData[];
  ReadNotifications: (options?: MutationFunctionOptions) => void;
}

const HeaderNotifications: FC<HeaderNotificationsProps> = (props) => {
  const { notifications, ReadNotifications, sx } = props;

  const theme = useTheme();

  const router = useRouter();

  const language = jsCookies.get('i18nextLng') ?? window?.localStorage?.getItem('i18nextLng') ?? 'vi';

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => {
    setOpen(true);

    const unreadNotifications = cloneDeep(notifications).filter(item => item.status === 'unread');
    if (unreadNotifications.length) {
      ReadNotifications({
        variables: {
          readNotificationInput: {
            ids: unreadNotifications.map(item => item.id),
          },
        },
        update: (cache, result, { variables }) => {
          const notificationIds = variables?.readNotificationInput?.ids ?? [];

          if (notificationIds) {
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
  }, [notifications, ReadNotifications]);

  const handleClose = (): void => {
    setOpen(false);
  };

  const { t }: { t: any } = useTranslation();

  return (
    <Box sx={sx}>
      <Tooltip arrow title={t('Notifications')}>
        <IconButtonWrapper
          color="secondary"
          ref={ref}
          onClick={handleOpen}
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
          <NotificationsBadge
            badgeContent={cloneDeep(notifications).filter(item => item.status === 'unread').length}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <NotificationIcon />
          </NotificationsBadge>
        </IconButtonWrapper>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        sx={{
          top: '8px',
          '.MuiPaper-root': {
            width: '460px',
          }
        }}
      >
        <Box sx={{ p: 2 }} display="flex" justifyContent="space-between">
          <Typography variant="inherit" fontSize="14px" fontWeight="700">{t('Notifications')}</Typography>
          {/* <Link href="#" variant="caption" sx={{ textTransform: 'none' }}>
            {t('Mark all as read')}
          </Link> */}
        </Box>

        <Divider />

        <Box
          sx={{
            height: '325px',
            overflowY: 'scroll',
            width: '100%',
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
                      style={{ color: theme.colors.secondary.light, fontWeight: 400, fontSize: '14px' }}
                    >
                      {domToReact(domNode.children, options)}
                    </a>
                  );
                }

                if (domNode.name === 'b') {
                  return (
                    <a
                      {...link && { href: link }}
                      style={{ color: theme.colors.primary.dark, fontWeight: 600, fontSize: '14px',  textDecoration: 'unset' }}
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
                  ...(index !== 0) && { borderTop: `1px solid ${theme.palette.grey[50]}` },
                  py: '8px',
                  px: { xs: '12px', md: '16px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* group content */}
                <Box display="flex" alignItems="center" flex={1}>
                  {/* logo */}
                  <ButtonCustom
                    startIcon={<LogoIcon width={40} height={40} />}
                    sx={{
                      p: 0,
                      pointerEvents: 'none',
                      minWidth: 'unset',
                      mr: '8px',
                    }}
                  />

                  {/* content */}
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      {/* title */}
                      <Typography
                        variant="inherit"
                        children={t(item.actor)}
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      />

                      {/* time */}
                      <Box>
                        <Typography
                          variant="inherit"
                          children={fromNow({ time: item.createdAt, language: language })}
                          sx={{
                            color: theme.colors.common.grey,
                            fontSize: '12px',
                            fontWeight: 400,
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="inherit"
                      children={parse(item.message, options)}
                    />
                  </Box>
                </Box>

                {/* group action */}
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'end', md: 'start' }}>
                  {/* icon */}
                  <ButtonCustom
                    startIcon={
                      <>
                        {item.code === 'review-request' && <LearningIcon width="24px" height="24px" />}
                        {item.code === 'congratulate-completing' && <CommentIcon width="24px" height="24px" />}
                        {item.code === 'welcome' && <LearningIcon width="24px" height="24px" />}
                      </>
                    }
                    onClick={() => window.location.href = item.link}
                    sx={{
                      p: 0,
                      minWidth: 'unset',
                      ml: '10px',
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        <Divider />

        <Box sx={{ m: 1 }}>
          <ButtonCustom
            color="primary"
            variant="text"
            sx={{ width: '100%', fontSize: '14px', fontWeight: 700 }}
            onClick={() => {
              handleClose();
              router.push('/notifications');
            }}
          >
            {t('View all notifications')}
          </ButtonCustom>
        </Box>
      </Popover>
    </Box>
  );
};

export default HeaderNotifications;

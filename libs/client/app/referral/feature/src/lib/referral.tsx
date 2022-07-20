/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { ToastifyContext } from '@els/client/app/shared/contexts';
import { Avatar, Box, DialogActions, Divider, Grid, InputAdornment, OutlinedInput, Popover, Tooltip, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import jsCookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BreadcrumbsCustom, ButtonCustom, ConfigIcon, EmailIcon, FacebookIcon, LinkIcon } from '@els/client/app/shared/ui';
import { useLazyQuery, ApolloError } from '@apollo/client';
import { GraphqlQueries, GraphqlTypes } from '@els/client/app/shared/data-access';
import { ApolloClient } from '@els/client/shared/data-access';
import { addAlpha, fromNow, handleApolloError } from '@els/client/shared/utils';
import { cloneDeep, orderBy } from 'lodash';
import { EmailShareButton, FacebookShareButton } from 'react-share';

const ReferralWrapper = styled(Box)(
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

export interface ReferralProps {}

export const Referral: FC<ReferralProps> = (props) => {
  const theme = useTheme();

  const router = useRouter();
  
  const { t }: { t: any } = useTranslation();

  const language = jsCookies.get('i18nextLng') ?? window?.localStorage?.getItem('i18nextLng') ?? 'vi';

  const { toastify } = useContext(ToastifyContext);

  // * page ref
  const ref = useRef<any>(null);
  const inviterUrlTooltipTimeoutRef = useRef<any>();

  // * page state
  const [isOpen, setOpen] = useState<boolean>(false);
  // const [currentUser, setCurrentUser] = useState<GraphqlTypes.LearningTypes.User>();
  const [usersAcceptInvitation, setUsersAcceptInvitation] = useState<GraphqlTypes.LearningTypes.User[]>([]);
  const [inviterUrl, setInviterUrl] = useState<string>('');
  const [inviterUrlTooltip, setInviterUrlTooltip] = useState<string>('');
  const [emailInviter, setEmailInviter] = useState<GraphqlTypes.LearningTypes.EmailResponse>();

  // * load data
  const [GetCurrentUser] = useLazyQuery<{ user: GraphqlTypes.LearningTypes.User }>(
    GraphqlQueries.LearningQueries.User.GetUser,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      // onCompleted: (data) => {
      //   if (data?.user) setCurrentUser(data?.user);
      // },
      onError: (error: ApolloError) => handleApolloError(error, toastify),
    }
  );

  const [GetUsersAcceptInvitation] = useLazyQuery<{ usersAcceptInvitation: GraphqlTypes.LearningTypes.User[] }>(
    GraphqlQueries.LearningQueries.User.GetUsersAcceptInvitation,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        if (data?.usersAcceptInvitation) setUsersAcceptInvitation(orderBy(data?.usersAcceptInvitation ?? [], ['createdAt'], 'desc'));
      },
      onError: (error: ApolloError) => handleApolloError(error, toastify),
    }
  );

  const [GetInvitation] = useLazyQuery<{ invitation: GraphqlTypes.LearningTypes.InvitationQueries }>(
    GraphqlQueries.LearningQueries.User.GetInvitation,
    {
      context: { serviceName: ApolloClient.ServiceName.Browser },
      onCompleted: (data) => {
        if (data?.invitation?.getLink) {
          setInviterUrl(data?.invitation?.getLink);
          setInviterUrlTooltip(data?.invitation?.getLink);
        }
        if (data?.invitation?.emailInviter) {
          setEmailInviter(data?.invitation?.emailInviter);
        }
      },
      onError: (error: ApolloError) => handleApolloError(error, toastify),
    }
  );

  // * handle logic
  const handleOpen = (): void => setOpen(true);

  const handleClose = (): void => setOpen(false);

  // * useEffect
  useEffect(() => {
    GetCurrentUser();

    GetUsersAcceptInvitation();

    GetInvitation();
  }, [router]);

  // * render ui
  return (
    <ReferralWrapper
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
        title={t('Referral')}
        breadcrumbsList={[]}
        icon={<ConfigIcon width="36px" height="36px" />}
      />

      {/* content */}
      <BoxWrapper sx={{ minHeight: '100%' }}>
        <Grid
          container
          rowSpacing={{ xs: 2, md: '20px' }}
          columnSpacing={{ xs: 2, md: '20px' }}
          alignItems="start"
        >
          {/* group link */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                px: { xs: 2, sm: 3, md: 5, lg: 12 },
                py: { xs: 2, sm: 3, md: 5, lg: 10 },
                borderRadius: '6px',
                backgroundImage: theme.colors.gradients[1],
                maxWidth: '640px',
                float: { xs: 'none', md: 'right'},
                m: 'auto',
              }}
            >
              {/* slogan */}
              <Typography
                variant="h3"
                children={t('Spread this love of learning to your friends')}
                sx={{
                  color: '#ffffff',
                  fontSize: { xs: '28px', md: '36px' },
                  fontWeight: 600,
                  lineHeight: '42px',
                  mb: { xs: '40px', md: '120px' }
                }}
              />

              {/* personal link */}
              <Box mb={{ xs: '20px', md: '40px' }}>
                <ButtonCustom
                  variant="text"
                  color="primary"
                  startIcon={<LinkIcon />}
                  children={t('Share your personal link')}
                  sx={{
                    color: '#ffffff',
                    fontSize: '20px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    p: 0,
                    mb: 1,
                  }}
                />
                <Tooltip
                  arrow placement="top" 
                  title={`${inviterUrlTooltip}`}
                >
                  <Box>
                    <OutlinedInput
                      fullWidth
                      type="text"
                      value={`${inviterUrl}`}
                      endAdornment={
                        <InputAdornment position="end">
                          <ButtonCustom
                            variant="text"
                            children={t('Copy link')}
                            sx={{
                              fontSize: '16px',
                              fontWeight: 700,
                              color: '#ffffff',
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(inviterUrl);
                              setInviterUrlTooltip(t('Copied'));
                              
                              if (inviterUrlTooltipTimeoutRef.current) clearTimeout(inviterUrlTooltipTimeoutRef.current);
                              inviterUrlTooltipTimeoutRef.current = setTimeout(() => {
                                setInviterUrlTooltip(inviterUrl);
                              }, 3000);
                            }}
                          />
                        </InputAdornment>
                      }
                      sx={{
                        backgroundColor: addAlpha('#ffffff', 0.2),
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#ffffff',
                        border: 'unset',
                        fieldset: { border: 'unset' },
                        pr: 0,
                        input: { p: '10px 0px 10px 10px' },
                      }}
                    />
                  </Box>
                </Tooltip>
              </Box>

              {/* social network */}
              <Box>
                <ButtonCustom
                  variant="text"
                  color="primary"
                  startIcon={<LinkIcon />}
                  children={t('Share via social network')}
                  sx={{
                    color: '#ffffff',
                    fontSize: '20px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    p: 0,
                    mb: 1,
                  }}
                />

                <Box>
                  {/* facebook */}
                  <FacebookShareButton
                    url={inviterUrl}
                    quote=""
                    hashtag=""
                  >
                    <ButtonCustom
                      variant="contained"
                      color="primary"
                      startIcon={<FacebookIcon />}
                      children="Facebook"
                      sx={{
                        border: 'solid 1px #ffffff',
                        backgroundColor: '#395185 !important',
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: 700,
                        mr: 1,
                      }}
                    />
                  </FacebookShareButton>
                  
                  {/* email */}
                  <EmailShareButton
                    url={''}
                    subject={emailInviter?.subject}
                    body={emailInviter?.body}
                  >
                    <ButtonCustom
                      variant="outlined"
                      color="primary"
                      startIcon={<EmailIcon color="#ffffff" />}
                      children="Email"
                      sx={{
                        border: 'solid 1px #ffffff !important',
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: 700,
                      }}
                    />
                  </EmailShareButton>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* group friends */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                maxWidth: '640px',
                float: { xs: 'none', md: 'left'},
                m: 'auto',
              }}
            >
              {/* referral picture */}
              <Box mb="28px">
                <img style={{ maxWidth: '100%' }} alt="referral" src="/images/source/referral/referral-picture.svg" />
              </Box>
              
              {/* invitations accepted */}
              <Box width="100%" textAlign="center">
                <Typography
                  variant="inherit"
                  children={`${usersAcceptInvitation.length} ${t('invitations accepted')}`}
                  sx={{
                    color: theme.colors.primary.main,
                    fontSize: '20px',
                    fontWeight: 400,
                    mb: '12px',
                  }}
                />
                <Box display="flex" alignItems="center" justifyContent="center">
                  {cloneDeep(usersAcceptInvitation).map((item, index) => {
                    if (index < 5)
                      return (
                        <Avatar
                          key={item?.id + index}
                          sx={{
                            width: '40px',
                            height: '40px',
                            mx: 0.5,
                            p: 0,
                            round: '#C4C4C4',
                            color: `${theme.colors.alpha.trueWhite[100]}`,
                          }}
                          src={item?.identity?.traits?.picture?.toString()}
                        />
                      );

                    return null;
                  })}

                  {usersAcceptInvitation.length > 5 && (
                    <ButtonCustom
                      variant="contained"
                      color="primary"
                      children={`+${usersAcceptInvitation.length - 5}`}
                      sx={{
                        minWidth: 'unset',
                        width: '40px',
                        height: '40px',
                        mx: 0.5,
                        p: 0,
                        borderRadius: '50%',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                      rest={{
                        ref: ref
                      }}
                      onClick={handleOpen}
                    />
                  )}
                  <Popover
                    anchorEl={ref.current}
                    onClose={handleClose}
                    open={isOpen}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                    sx={{ top: '8px' }}
                  >
                    <Box p={2} display="flex" justifyContent="space-between">
                      <Typography variant="h5">{t('All')}</Typography>
                    </Box>

                    <Divider />

                    <Box
                      sx={{
                        p: 2,
                        overflowY: 'scroll',
                        maxHeight: '300px',
                      }}
                    >
                      {cloneDeep(usersAcceptInvitation).map((item, index) => {
                        return (
                          <Box
                            key={item?.id + index}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            {...(index !== 0) && { pt: 1 }}
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                            >
                              <Avatar
                                sx={{
                                  width: '40px',
                                  height: '40px',
                                  p: 0,
                                  background: '#C4C4C4',
                                  color: `${theme.colors.alpha.trueWhite[100]}`,
                                }}
                                src={item?.identity?.traits?.picture?.toString()}
                              />
                              <Typography
                                variant="inherit"
                                children={`${item?.identity?.traits?.firstName ?? t('User')} ${item?.identity?.traits?.lastName ?? ''}`}
                                sx={{
                                  fontSize: '14px',
                                  fontWeight: 700,
                                  mx: '16px',
                                }}
                              />
                            </Box>
                             
                            <Typography
                              variant="inherit"
                              children={fromNow({ time: item.createdAt, language: language, showDetails: true, format: 'DD MMMM, YYYY' })}
                              sx={{
                                opacity: .5,
                                fontWeight: 400,
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Divider />

                    <DialogActions>
                      <ButtonCustom
                        children={t('Close')}
                        onClick={handleClose}
                        sx={{
                          fontSize: '13px',
                          color: theme.colors.secondary.main,
                          fontWeight: 400
                        }}
                      />
                    </DialogActions>
                  </Popover>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </BoxWrapper>
    </ReferralWrapper>
  );
};

export default Referral;

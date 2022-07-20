import React, { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { AttendanceIcon, ButtonCustom, LoadingData, StreakIcon, TopicCompletedIcon } from '@els/client/app/shared/ui';

export interface InfoPanelProps {
  currentUser: GraphqlTypes.LearningTypes.User | undefined;
  getCurrentUserLoading: boolean;
}
const InfoPanel: FC<InfoPanelProps> = ({ currentUser, getCurrentUserLoading }) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundImage: theme.colors.gradients[10],
        boxShadow: theme.colors.shadows.card,
        borderRadius: '6px',
        py: { xs: '20px', sm: '30px', md: '60px' },
        px: { xs: '20px', sm: '30px', md: '20px', lg: '72px' },
        minHeight: '280px',
        flex: '1 1 50%',
        mr: {
          xs: 0,
          md: '10px',
        },
        display: 'flex',
        flexDirection: {
          xs: 'column',
          sm: 'row',
          md: 'column',
          lg: 'row',
        },
        alignItems: {
          xs: 'start',
          sm: 'center',
          md: 'start',
          lg: 'center',
        },
        justifyContent: {
          xs: 'row',
          sm: 'space-between',
          md: 'row',
          lg: 'space-between',
        },
      }}
    >
      <Box flex="1" mr={{ xs: 0, sx: '10px', md: 0, lg: '40px' }}>
        <Box width="fit-content">
          {/* attendance */}
          <Box display="flex">
            {/* icon */}
            <Box>
              <ButtonCustom
                variant="contained"
                color="success"
                startIcon={
                  <AttendanceIcon
                    width={{
                      xs: '24px',
                      sm: '32px',
                      md: '24px',
                      lg: '32px',
                    }}
                    height={{
                      xs: '24px',
                      sm: '32px',
                      md: '24px',
                      lg: '32px',
                    }}
                    color="#ffffff"
                  />
                }
                sx={{
                  minWidth: 'unset',
                  width: {
                    xs: '50px',
                    sm: '60px',
                    md: '50px',
                    lg: '60px',
                  },
                  height: {
                    xs: '50px',
                    sm: '60px',
                    md: '50px',
                    lg: '60px',
                  },
                  mr: theme.spacing(3),
                  backgroundImage: theme.colors.gradients[9],
                  boxShadow: theme.colors.shadows.success,
                  pointerEvents: 'none',
                }}
              />
            </Box>

            {/* group value */}
            <Box display="flex" flexDirection="column">
              {/* value */}
              <Typography
                variant="subtitle1"
                children={
                  getCurrentUserLoading ? (
                    <LoadingData />
                  ) : (
                    currentUser?.extraInfo?.numberOfCheckInDays
                  )
                }
                sx={{
                  position: 'relative',
                  fontSize: {
                    xs: '28px',
                    sm: '36px',
                    md: '28px',
                    lg: '36px',
                  },
                  fontWeight: 700,
                  lineHeight: {
                    xs: '32px',
                    sm: '42px',
                    md: '32px',
                    lg: '42px',
                  },
                  color: theme.colors.alpha.trueWhite[100],
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              />

              {/* description */}
              <Typography
                variant="subtitle1"
                children={t('Attendance days')}
                sx={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '16px',
                  color: theme.colors.alpha.trueWhite[100],
                }}
              />
            </Box>
          </Box>

          {/* max streak */}
          <Box display="flex" mt="40px">
            {/* icon */}
            <Box>
              <ButtonCustom
                variant="contained"
                color="error"
                startIcon={
                  <StreakIcon
                    width={{
                      xs: '24px',
                      sm: '32px',
                      md: '24px',
                      lg: '32px',
                    }}
                    height={{
                      xs: '24px',
                      sm: '32px',
                      md: '24px',
                      lg: '32px',
                    }}
                    color="#ffffff"
                  />
                }
                sx={{
                  minWidth: 'unset',
                  width: {
                    xs: '50px',
                    sm: '60px',
                    md: '50px',
                    lg: '60px',
                  },
                  height: {
                    xs: '50px',
                    sm: '60px',
                    md: '50px',
                    lg: '60px',
                  },
                  mr: theme.spacing(3),
                  backgroundImage: theme.colors.gradients[8],
                  boxShadow: theme.colors.shadows.error,
                  pointerEvents: 'none',
                }}
              />
            </Box>

            {/* group value */}
            <Box display="flex" flexDirection="column">
              {/* value */}
              <Typography
                variant="subtitle1"
                children={
                  getCurrentUserLoading ? (
                    <LoadingData />
                  ) : (
                    currentUser?.extraInfo?.maxNumberOfStreaks
                  )
                }
                sx={{
                  fontSize: {
                    xs: '28px',
                    sm: '36px',
                    md: '28px',
                    lg: '36px',
                  },
                  fontWeight: 700,
                  lineHeight: {
                    xs: '32px',
                    sm: '42px',
                    md: '32px',
                    lg: '42px',
                  },
                  color: theme.colors.alpha.trueWhite[100],
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              />

              {/* description */}
              <Typography
                variant="subtitle1"
                children={t('Highest streak date achieved')}
                sx={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '16px',
                  color: theme.colors.alpha.trueWhite[100],
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        flex="1"
        ml={{ xs: 0, sx: '10px', md: 0, lg: '40px' }}
        display="flex"
        justifyContent="end"
      >
        <Box
          width="fit-content"
          mt={{ xs: '40px', sm: 0, md: '40px', lg: 0 }}
        >
          {/* Completed topics */}
          <Box display="flex">
            {/* icon */}
            <Box>
              <ButtonCustom
                variant="contained"
                color="warning"
                startIcon={
                  <TopicCompletedIcon
                    width={{
                      xs: '24px',
                      sm: '32px',
                      md: '24px',
                      lg: '32px',
                    }}
                    height={{
                      xs: '24px',
                      sm: '32px',
                      md: '24px',
                      lg: '32px',
                    }}
                    color="#ffffff"
                  />
                }
                sx={{
                  minWidth: 'unset',
                  width: {
                    xs: '50px',
                    sm: '60px',
                    md: '50px',
                    lg: '60px',
                  },
                  height: {
                    xs: '50px',
                    sm: '60px',
                    md: '50px',
                    lg: '60px',
                  },
                  mr: theme.spacing(3),
                  backgroundImage: theme.colors.gradients[2],
                  boxShadow: theme.colors.shadows.info,
                  pointerEvents: 'none',
                }}
              />
            </Box>

            {/* group value */}
            <Box display="flex" flexDirection="column">
              {/* value */}
              <Typography
                variant="subtitle1"
                children={
                  getCurrentUserLoading ? (
                    <LoadingData />
                  ) : (
                    currentUser?.extraInfo?.numberOfCompletedTopics
                  )
                }
                sx={{
                  fontSize: {
                    xs: '28px',
                    sm: '36px',
                    md: '28px',
                    lg: '36px',
                  },
                  fontWeight: 700,
                  lineHeight: {
                    xs: '32px',
                    sm: '42px',
                    md: '32px',
                    lg: '42px',
                  },
                  color: theme.colors.alpha.trueWhite[100],
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              />

              {/* description */}
              <Typography
                variant="subtitle1"
                children={t('Completed topics')}
                sx={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '16px',
                  color: theme.colors.alpha.trueWhite[100],
                }}
              />
            </Box>
          </Box>

          {/* current streak */}
          <Box display="flex" mt="40px">
            {/* icon */}
            <Box>
              <ButtonCustom
                variant="contained"
                color="info"
                startIcon={
                  <StreakIcon
                    width={{
                      xs: '24px',
                      sm: '32px',
                      md: '24px',
                      lg: '32px',
                    }}
                    height={{
                      xs: '24px',
                      sm: '32px',
                      md: '24px',
                      lg: '32px',
                    }}
                    color="#ffffff"
                  />
                }
                sx={{
                  minWidth: 'unset',
                  width: {
                    xs: '50px',
                    sm: '60px',
                    md: '50px',
                    lg: '60px',
                  },
                  height: {
                    xs: '50px',
                    sm: '60px',
                    md: '50px',
                    lg: '60px',
                  },
                  mr: theme.spacing(3),
                  backgroundImage: theme.colors.gradients[4],
                  boxShadow: theme.colors.shadows.warning,
                  pointerEvents: 'none',
                }}
              />
            </Box>

            {/* group value */}
            <Box display="flex" flexDirection="column">
              {/* value */}
              <Typography
                variant="subtitle1"
                children={
                  getCurrentUserLoading ? (
                    <LoadingData />
                  ) : (
                    currentUser?.extraInfo?.currentStreakList?.streaks
                      ?.length ?? 0
                  )
                }
                sx={{
                  fontSize: {
                    xs: '28px',
                    sm: '36px',
                    md: '28px',
                    lg: '36px',
                  },
                  fontWeight: 700,
                  lineHeight: {
                    xs: '32px',
                    sm: '42px',
                    md: '32px',
                    lg: '42px',
                  },
                  color: theme.colors.alpha.trueWhite[100],
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              />

              {/* description */}
              <Typography
                variant="subtitle1"
                children={t('Current streak date')}
                sx={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '16px',
                  color: theme.colors.alpha.trueWhite[100],
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export{ InfoPanel };

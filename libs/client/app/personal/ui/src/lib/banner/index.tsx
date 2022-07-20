import React, { FC } from 'react';
import { Avatar, Box, CircularProgress, circularProgressClasses, Typography, useTheme } from '@mui/material';
import { ButtonCustom } from '@els/client/app/shared/ui';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { addAlpha } from '@els/client/shared/utils';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useTranslation } from 'react-i18next';
export interface BannerProps {
  currentUser: GraphqlTypes.LearningTypes.User;
}

const Banner: FC<BannerProps> = ({ currentUser }) => {
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  return (
    <div>
      <Box
        sx={{
          width: '100%',
          height: '200px',
          backgroundImage: theme.colors.gradients[3],
          p: {
            xs: theme.spacing(1),
            md: theme.spacing(3, 4.5),
          },
          display: 'flex',
          borderRadius: '6px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '82px',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              width: '82px',
              height: '82px',
              mr: 2,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: '0%',
                top: '0%',
                width: '100%',
                height: '100%',
                padding: '9px',
              }}
            >
              <Avatar
                sx={{
                  width: '100%',
                  height: '100%',
                  p: 0,
                  background: `${theme.colors.alpha.trueWhite[10]}`,
                  color: `${theme.colors.alpha.trueWhite[100]}`,
                }}
                src={currentUser?.identity?.traits?.picture?.toString()}
              />
            </Box>
            <CircularProgress
              variant="determinate"
              thickness={5}
              size={82}
              value={100 - Math.floor((currentUser?.exp ?? 0) / (currentUser?.nextLevelExp ?? 1) * 100)}
              sx={{
                color: addAlpha('#ffffff', 0.3),
                transform: `rotate(${-90 + Math.floor((currentUser?.exp ?? 0) / (currentUser?.nextLevelExp ?? 1) * 100) * 3.6}deg) !important`,
              }}

            />
            <CircularProgress
              variant="determinate"
              thickness={5}
              size={82}
              value={Math.floor((currentUser?.exp ?? 0) / (currentUser?.nextLevelExp ?? 1) * 100)}
              id={(Math.floor((currentUser?.exp ?? 0) / (currentUser?.nextLevelExp ?? 1) * 100)).toString()}
              sx={{
                animationDuration: '550ms',
                position: 'absolute',
                top: 0,
                left: 0,
                color: '#ffffff',
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: 'unset !important',
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'start',
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                variant="inherit"
                children={<ArrowUpwardIcon sx={{ fontSize: '16px' }} />}
                sx={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  color: theme.colors.success.main,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mr: 1,
                }}
              />
              <Typography
                variant="inherit"
                children={currentUser?.expDate ?? 0}
                sx={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ButtonCustom
                variant="contained"
                color="warning"
                children={`${t('Lv')} ${currentUser.level}`}
                sx={{
                  p: '4px 8px',
                  mr: 1,
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '16px',
                  color: '#ffffff',
                  backgroundColor: theme.colors.warning.light,
                  borderRadius: '4px',
                  cursor: 'default',
                  pointerEvents: 'none',
                }}
              />
              <Typography
                variant="inherit"
                children={`${currentUser.exp}/${currentUser.nextLevelExp}`}
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#ffffff',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

    </div>
  );
};

export { Banner };
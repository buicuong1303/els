/* eslint-disable @typescript-eslint/no-explicit-any */

import { AttendanceIcon, BrainIcon, ButtonCustom, StreakIcon, TopicCompletedIcon } from '@els/client/app/shared/ui';
import { Dialog, DialogContent, DialogTitle, Divider, Grid, Typography, useTheme, Avatar, styled, DialogActions } from '@mui/material';
import { Box, SxProps } from '@mui/system';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import usFlag from 'country-flag-icons/3x2/US.svg';
import vnFlag from 'country-flag-icons/3x2/VN.svg';
import { GraphqlTypes } from '@els/client/app/shared/data-access';

const BoxCenterWrapper = styled(Box)(
  ({ theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `
);

const ImageWrapper = styled('img')(
  () => `
    width: 30px;
  `
);

interface RankUserCardProps {
  open: boolean;
  onClose: () => void;
  rankUserInfo?: GraphqlTypes.LearningTypes.RankUserInfo;
  sx?: SxProps;
  rest?: any;
}

const RankUserCard: FC<RankUserCardProps> = (props) => {
  const { open, onClose, rankUserInfo, sx } = props;

  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  const usFlagObject: any = usFlag;
  const vnFlagObject: any = vnFlag;

  if (!rankUserInfo) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      sx={{
        '.MuiPaper-root': {
          minWidth: '340px',
          maxWidth: '640px',
          minHeight: '400px',
          // backgroundImage: theme.colors.gradients[1],
          backgroundColor: theme.colors.alpha.white[100],
          boxShadow: theme.colors.shadows.card,
          borderRadius: '6px',
        },
        ...sx,
      }}
    >
      {/* header */}
      <DialogTitle sx={{ p: 2.5 }}>
        {/* title */}
        <Typography
          children={t('Information of your classmates')}
          sx={{
            fontSize: '16px',
            fontWeight: 700,
          }}
        />
      </DialogTitle>

      {/* border */}
      <Divider sx={{ width: '100%', height: '1px', backgroundColor: theme.colors.alpha.black[30], }} />

      {/* content */}
      <DialogContent sx={{ p: theme.spacing(1, 2.5, 4.5) }}>
        {/* Group info */}
        <Box display="flex" justifyContent="center">
          {/* group avatar */}
          <BoxCenterWrapper
            sx={{
              flex: 1,
            }}
          >
            {/* avatar */}
            <Box
              position="relative"
              sx={{
                backgroundColor: theme.colors.warning.light,
                borderRadius: '50%',
                padding: '5px',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 'calc(100% - 10px)',
                  height: 'calc(100% - 10px)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                }}
              />
              <Avatar
                sx={{
                  width: { xs: '60px', md: '90px' },
                  height: { xs: '60px', md: '90px' },
                  p: 0,
                }}
                src={rankUserInfo?.userInfo?.identity?.traits?.picture?.toString()}
              />
              <Box position="absolute" left={{ xs: '-6px', md: '-6px' }} bottom={{ xs: '0px', md: '6px' }}>
                {rankUserInfo.fromLang === 'vi' && <ImageWrapper alt={t('Vietnam')} src={vnFlagObject.src} />}
                {rankUserInfo.fromLang === 'en' && <ImageWrapper alt={t('US')} src={usFlagObject.src} />}
              </Box>
            </Box>

            {/* name */}
            <Typography
              variant="subtitle1"
              children={`${rankUserInfo?.userInfo?.identity?.traits?.firstName} ${rankUserInfo?.userInfo?.identity?.traits?.lastName}`}
              sx={{
                mt: 1,
                fontSize: { xs: '18px', md: '24px' },
                fontWeight: 700,
                color: theme.colors.primary.light,
                textAlign: 'center',
              }}
            />
          </BoxCenterWrapper>

          {/* group level */}
          <BoxCenterWrapper 
            sx={{
              flex: 1,
              alignItems: 'start',
            }}
          >
            {/* level */}
            <Typography
              children={`${t('Level')} ${rankUserInfo.rankInfo?.level}`}
              sx={{
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
                fontWeight: 700,
                color: theme.colors.primary.main,
                mb: { xs: '6px', md: '10px' },
                lineHeight: 1,
              }}
            />

            {/* status */}
            <Typography
              variant="subtitle1"
              children={t('Studying')}
              sx={{
                mb: { xs: '5px', md: '8px' },
                fontSize: '18px',
                fontWeight: 400,
                color: theme.colors.secondary.main,
                lineHeight: 1,
              }}
            />

            {/* flag */}
            {rankUserInfo.learningLang === 'vi' && <ImageWrapper alt={t('Vietnam')} src={vnFlagObject.src} />}
            {rankUserInfo.learningLang === 'en' && <ImageWrapper alt={t('US')} src={usFlagObject.src} />}
          </BoxCenterWrapper>
        </Box>

        {/* group data */}
        <Box mt={5} px={'12px'}>
          <Grid
            container
            rowSpacing={{ xs: 2, md: 3 }}
            columnSpacing={{ xs: 2, md: 6 }}
            alignItems="start"
          >
            {/* attendance */}
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              {/* icon */}
              <Box>
                <ButtonCustom
                  variant="contained"
                  color="success"
                  startIcon={
                    <AttendanceIcon
                      color="#ffffff"
                      sx={{
                        width: { xs: '24px', md: '30px' },
                        height: { xs: '24px', md: '30px' },
                      }}
                    />
                  }
                  sx={{
                    cursor: 'unset',
                    minWidth: 'unset',
                    width: { xs: '40px', md: '60px' },
                    height: { xs: '40px', md: '60px' },
                    color: 'unset',
                    mr: theme.spacing(3),
                    pointerEvents: 'none',
                    backgroundImage: theme.colors.gradients[9],
                  }}
                />
              </Box>

              {/* group value */}
              <Box>
                {/* value */}
                <Typography
                  variant="inherit"
                  children={rankUserInfo.attendance}
                  sx={{
                    fontSize: '24px',
                    fontWeight: 700,
                    lineHeight: '28px',
                  }}
                />

                {/* description */}
                <Typography
                  variant="subtitle1"
                  children={t('Attendance days')}
                  sx={{
                    mt: 1,
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '18px',
                  }}
                />
              </Box>
            </Grid>

            {/* current streak day */}
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              {/* icon */}
              <Box>
                <ButtonCustom
                  variant="contained"
                  color="info"
                  startIcon={
                    <StreakIcon
                      color="#ffffff"
                      sx={{
                        width: { xs: '24px', md: '30px' },
                        height: { xs: '24px', md: '30px' },
                      }}
                    />
                  }
                  sx={{
                    cursor: 'unset',
                    minWidth: 'unset',
                    width: { xs: '40px', md: '60px' },
                    height: { xs: '40px', md: '60px' },
                    color: 'unset',
                    mr: theme.spacing(3),
                    pointerEvents: 'none',
                    backgroundImage: theme.colors.gradients[4],
                  }}
                />
              </Box>

              {/* group value */}
              <Box>
                {/* value */}
                <Typography
                  variant="inherit"
                  children={rankUserInfo.currentStreak}
                  sx={{
                    fontSize: '24px',
                    fontWeight: 700,
                    lineHeight: '28px',
                  }}
                />

                {/* description */}
                <Typography
                  variant="subtitle1"
                  children={t('Current streak date')}
                  sx={{
                    mt: 1,
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '18px',
                  }}
                />
              </Box>
            </Grid>

            {/* topic completed */}
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              {/* icon */}
              <Box>
                <ButtonCustom
                  variant="contained"
                  color="warning"
                  startIcon={
                    <TopicCompletedIcon
                      color="#ffffff"
                      sx={{
                        width: { xs: '24px', md: '30px' },
                        height: { xs: '24px', md: '30px' },
                      }}
                    />
                  }
                  sx={{
                    cursor: 'unset',
                    minWidth: 'unset',
                    width: { xs: '40px', md: '60px' },
                    height: { xs: '40px', md: '60px' },
                    color: 'unset',
                    mr: theme.spacing(3),
                    pointerEvents: 'none',
                    backgroundImage: theme.colors.gradients[2],
                  }}
                />
              </Box>

              {/* group value */}
              <Box>
                {/* value */}
                <Typography
                  variant="inherit"
                  children={rankUserInfo.rankInfo?.topic}
                  sx={{
                    fontSize: '24px',
                    fontWeight: 700,
                    lineHeight: '28px',
                  }}
                />

                {/* description */}
                <Typography
                  variant="subtitle1"
                  children={t('Completed topics')}
                  sx={{
                    mt: 1,
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '18px',
                  }}
                />
              </Box>
            </Grid>

            {/* work memoried */}
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              {/* icon */}
              <Box>
                <ButtonCustom
                  variant="contained"
                  color="success"
                  startIcon={
                    <BrainIcon
                      color="#ffffff"
                      sx={{
                        width: { xs: '24px', md: '30px' },
                        height: { xs: '24px', md: '30px' },
                      }}
                      bgcolor="#ffffff00"
                    />
                  }
                  sx={{
                    cursor: 'unset',
                    minWidth: 'unset',
                    width: { xs: '40px', md: '60px' },
                    height: { xs: '40px', md: '60px' },
                    color: 'unset',
                    mr: theme.spacing(3),
                    pointerEvents: 'none',
                    backgroundImage: theme.colors.gradients[9],
                  }}
                />
              </Box>

              {/* group value */}
              <Box>
                {/* value */}
                <Typography
                  variant="inherit"
                  children={rankUserInfo.rankInfo?.word}
                  sx={{
                    fontSize: '24px',
                    fontWeight: 700,
                    lineHeight: '28px',
                  }}
                />

                {/* description */}
                <Typography
                  variant="subtitle1"
                  children={t('words are memorized')}
                  sx={{
                    mt: 1,
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '18px',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* border */}
      <Divider sx={{ width: '100%', height: '1px', backgroundColor: theme.colors.alpha.black[30], }} />

      <DialogActions sx={{ p: 2 }}>
        <ButtonCustom
          children={t('Close')}
          onClick={onClose}
          sx={{
            fontSize: '13px',
            color: theme.colors.secondary.main,
            fontWeight: 400
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export { RankUserCard };

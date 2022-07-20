/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { FC, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/system';
import { ButtonCustom, StreakIcon } from '@els/client/app/shared/ui';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { cloneDeep, orderBy } from 'lodash';
import moment from 'moment-timezone';
import { getWeekday } from '@els/client/shared/utils';

const StreaksBadge = styled(Badge)(
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

interface HeaderStreaksProps {
  currentUser?: GraphqlTypes.LearningTypes.User;
  sx?: SxProps;
}

const HeaderStreaks: FC<HeaderStreaksProps> = (props) => {
  const { currentUser, sx } = props;

  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  // * page state
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const [streaks, setStreaks] = useState<any[]>([]);

  // * handle logic
  const handleOpen = (): void => setOpen(true);

  const handleClose = (): void => setOpen(false);

  useEffect(() => {
    const maxStreakLength = 7;

    const streaks = orderBy(currentUser?.extraInfo?.currentStreakList?.streaks ?? [], ['createdAt'], 'asc');

    const noHadStreakToday = moment(new Date()).format('MM-DD-YYYY') !== moment(cloneDeep(streaks).reverse()[0]?.createdAt).format('MM-DD-YYYY');

    if (!streaks.length || noHadStreakToday) {
      streaks.push({
        createdAt: new Date(),
        expDate: currentUser?.expDate ?? 0,
        expTarget: currentUser?.setting?.appSetting?.exp ?? 0,
      });
    }

    if (streaks.length < maxStreakLength) {
      [... new Array(maxStreakLength - streaks.length)].forEach((item, index) => {
        streaks.push({
          createdAt: moment().add(index + 1, 'day'),
          expDate: 0,
          expTarget: currentUser?.setting?.appSetting?.exp ?? 0,
        });
      });
    }

    if (streaks.length > maxStreakLength) {
      streaks.splice(0, streaks.length - maxStreakLength);
    }

    setStreaks(streaks);
  }, [currentUser]);

  // useEffect(() => console.log(streaks), [streaks]);

  return (
    <Box sx={sx}>
      <Tooltip arrow title={t('Streaks')}>
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
          <StreaksBadge
            badgeContent={currentUser?.extraInfo?.currentStreakList?.streaks?.length ?? 0}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <StreakIcon />
          </StreaksBadge>
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
        sx={{ top: '8px' }}
      >
        <Box sx={{ p: 2 }} display="flex" justifyContent="space-between">
          <Typography variant="h5">{t('Streaks')}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            pt: 3,
            pb: 1.5,
            minWidth: '300px',
          }}
        >
          {/* streak line */}
          <Box
            sx={{
              display: 'flex',
            }}
          >
            {
              streaks.map((item: any, index: number) => {
                return (
                  <Box
                    key={`${item}-${index}`}
                    sx={{
                      zIndex: streaks.length - index,
                      position: 'relative',
                      height: '4px',
                      width: '56px',
                      flex: 1,
                      left: 0,
                      transform: 'translate(-50%, 0)',
                      backgroundImage:
                        index === 0
                          ? '#ffffff00'
                          : (item.expDate > 0 && item.expDate > item.expTarget)
                            ? theme.colors.gradients[4]
                            : `linear-gradient(${theme.colors.secondary.light}, ${theme.colors.secondary.light}) !important`,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        left: '100%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '32px',
                      }}
                    >
                      <Box sx={{ mt: '100%' }} />

                      <ButtonCustom
                        variant="contained"
                        color="warning"
                        startIcon={
                          <StreakIcon
                            color="#ffffff"
                            sx={{
                              width: '16px',
                              height: '16px',
                              position: 'relative',
                              left: '50%',
                              transform: 'translate(-50%, 0%)'
                            }}
                          />
                        }
                        sx={{
                          position: 'absolute',
                          p: 0,
                          backgroundImage: `${
                            item.expDate > 0 && item.expDate >= item.expTarget 
                              ? theme.colors.gradients[4]
                              : 'linear-gradient('+theme.colors.secondary.light+', '+theme.colors.secondary.light+')'} !important`,
                          cursor: 'unset',
                          minWidth: 'unset',
                          color: 'unset',
                          borderRadius: '50%',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          '& .MuiButton-startIcon': {
                            mx: 0,
                          },
                        }}
                      />

                      <Typography
                        children={t(getWeekday(new Date(item.createdAt), true))}
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translate(-50%, 0%)',
                          fontSize: '12px',
                          fontWeight: 400,
                          color: theme.colors.secondary.light
                        }}
                      />
                    </Box>
                  </Box>
                );
              })
            }
          </Box>
          
          {/* max streak */} 
          <Box
            sx={{
              width: '100%',
              mt: 5.5,
              textAlign: 'center',
            }}
          >
            <ButtonCustom
              variant="contained"
              color="warning"
              children={currentUser?.extraInfo?.currentStreakList?.streaks?.length ?? 0}
              sx={{
                backgroundImage: theme.colors.gradients[4],
                borderRadius: '50%',
                minWidth: 'unset',
                width: '36px',
                height: '36px',
                pointerEvents: 'none',
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '24px',
                boxShadow: theme.colors.shadows.card,
              }}
            />
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default HeaderStreaks;

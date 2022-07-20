import { GraphqlTypes } from '@els/client/app/shared/data-access';
import {
  BrainIcon,
  ButtonCustom,
  CheckListIcon,
  LineProgress,
  LoadingData,
} from '@els/client/app/shared/ui';
import { FromNow, TimeRemaining } from '@els/client/shared/ui';
import { addAlpha } from '@els/client/shared/utils';
import { Box, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PersonalMissionProps } from '.';
const PersonalAssignedMissions: FC<PersonalMissionProps> = ({
  assignedMissionLoadingIds,
  doneAssignedMissionLoading,
  language,
  personalAssignedMissions,
  handlePerform,
  handleGetRewarded,
}) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const renderPersonalAssignedMissions = () => {
    return personalAssignedMissions.map((item, index) => {
      let color:
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'error'
      | 'info'
      | 'warning'
      | undefined = 'primary';
      const missionColors = {
        [GraphqlTypes.LearningTypes.MissionCode.CheckIn]: { color: 'success' },
        [GraphqlTypes.LearningTypes.MissionCode.ReviewForgot]: {
          color: 'error',
        },
        [GraphqlTypes.LearningTypes.MissionCode.ReviewVague]: {
          color: 'warning',
        },
        [GraphqlTypes.LearningTypes.MissionCode.LearnNew]: { color: 'info' },
      };

      const colorCode:
      | GraphqlTypes.LearningTypes.MissionCode.CheckIn
      | GraphqlTypes.LearningTypes.MissionCode.ReviewForgot
      | GraphqlTypes.LearningTypes.MissionCode.ReviewVague
      | GraphqlTypes.LearningTypes.MissionCode.LearnNew = item?.mission?.code;

      color = missionColors[colorCode].color as typeof color;

      const timeZone = new Date(item.createdAt).getTimezoneOffset();

      const missionStatusTime = () => {
        const missionStatus = [
          GraphqlTypes.LearningTypes.AssignedMissionStatus.InProgress,
          GraphqlTypes.LearningTypes.AssignedMissionStatus.Incomplete,
        ];
        const endTime = moment(item.expiredAt) ?? moment().endOf('day');
        if (missionStatus.includes(item.status)) {
          return (
            <TimeRemaining
              timeZone={timeZone}
              language={language}
              contentTimedOut={t('The mission has expired')}
              endTime={endTime}
            />
          );
        }
        return (
          <Box
            component="span"
            children={
              <>
                {t('Completed')}
                &nbsp;
                <FromNow
                  timeZone={timeZone}
                  startTime={moment(item.completedAt)}
                  language={language}
                />
              </>
            }
          />
        );
      };
      const progress =
        item.missionTarget?.maxProgress ?? item.mission.maxProgress;
      const percentColor = () => {
        if (item.currentProgress >= progress) {
          return theme.colors.success.main;
        }
        return theme.colors.info.main;
      };
      // render ui
      return (
        <Box
          key={`${item?.id}-${index}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(204, 204, 204, 0.3)',
          }}
        >
          {/* icon */}
          <Box
            sx={{
              mr: {
                xs: '12px',
                sm: '20px',
                md: '12px',
                lg: '20px',
              },
            }}
          >
            <ButtonCustom
              variant="contained"
              color={color}
              startIcon={
                <BrainIcon
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
                  bgcolor={theme.colors[color].main}
                />
              }
              {...(item.mission.code ===
                GraphqlTypes.LearningTypes.MissionCode.CheckIn && {
                startIcon: (
                  <CheckListIcon
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
                ),
              })}
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
                pointerEvents: 'none',
              }}
            />
          </Box>

          {/* group process */}
          <Box
            sx={{
              flex: 1,
              mr: {
                xs: '12px',
                sm: '20px',
                md: '12px',
                lg: '20px',
              },
            }}
          >
            {/* content */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: { xs: 0.5, sm: 1.5, md: 0.5, lg: 1.5 } }}
            >
              <Typography
                variant="inherit"
                children={language === 'vi' ? t(item.mission.title) : item.mission.titleEn}
                sx={{
                  fontSize: {
                    xs: '16px',
                    sm: '20px',
                    md: '16px',
                    lg: '20px',
                  },
                  fontWeight: 500,
                  lineHeight: '23.44px',
                }}
              />
              <Typography
                display={{
                  xs: 'none',
                  sm: 'block',
                  md: 'none',
                  lg: 'block',
                }}
                variant="inherit"
                children={missionStatusTime()}
                sx={{
                  color: theme.colors.secondary.main,
                  fontSize: {
                    xs: '14px',
                    sm: '16px',
                    md: '14px',
                    lg: '16px',
                  },
                  fontWeight: 400,
                }}
              />
            </Box>

            {/* line process */}
            <Box>
              <LineProgress
                height="12px"
                width="100%"
                allStep={progress}
                currentStep={item.currentProgress}
                fullColor={addAlpha(theme.palette.common.black, 0.15)}
                percentColor={percentColor()}
                color={theme.colors.secondary.main}
                processPosition="right"
                sx={{
                  '.MuiTypography-root': {
                    '.MuiBox-root': {
                      fontSize: '16px',
                      fontWeight: 500,
                    },
                  },
                }}
              />
            </Box>

            <Typography
              display={{
                xs: 'block',
                sm: 'none',
                md: 'block',
                lg: 'none',
              }}
              variant="inherit"
              children={missionStatusTime()}
              sx={{
                color: theme.colors.secondary.main,
                fontSize: {
                  xs: '14px',
                  sm: '16px',
                  md: '14px',
                  lg: '16px',
                },
                fontWeight: 400,
                mt: 0.5,
              }}
            />
          </Box>

          {/* action */}
          <Box
            sx={{
              textAlign: 'center',
              minWidth: '110px',
            }}
          >
            {item.status ===
              GraphqlTypes.LearningTypes.AssignedMissionStatus.InProgress && (
              <>
                {/* button */}
                <ButtonCustom
                  variant="contained"
                  color="info"
                  children={t('Perform')}
                  onClick={() => handlePerform(item.mission.code)}
                  sx={{
                    minWidth: 'unset',
                    p: {
                      xs: theme.spacing(0, 1),
                      md: theme.spacing(0, 1.5),
                    },
                    fontSize: '13px',
                    fontWeight: { xs: 500, md: 700 },
                    lineHeight: '15px',
                    minHeight: '32px',
                  }}
                />

                {/* exp */}
                <Typography
                  variant="inherit"
                  children={`+ ${item.mission.reward.value} ${t(
                    item.mission.reward.rewardUnit.code
                  )}`}
                  sx={{
                    color: theme.colors.info.main,
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                />
              </>
            )}

            {item.status ===
              GraphqlTypes.LearningTypes.AssignedMissionStatus.Completed && (
              <>
                {/* button */}
                <ButtonCustom
                  variant="contained"
                  color="warning"
                  children={
                    doneAssignedMissionLoading &&
                    assignedMissionLoadingIds[item.id] ? (
                      // eslint-disable-next-line @typescript-eslint/indent
                      <LoadingData />
                      ) : (
                        t('Get rewarded')
                      )
                  }
                  onClick={() =>
                    handleGetRewarded({
                      assignedMissionId: item.id,
                    })
                  }
                  sx={{
                    minWidth: 'unset',
                    p: {
                      xs: theme.spacing(0, 1),
                      md: theme.spacing(0, 1.5),
                    },
                    fontSize: '13px',
                    fontWeight: { xs: 500, md: 700 },
                    lineHeight: '15px',
                    minHeight: '32px',
                  }}
                />

                {/* exp */}
                <Typography
                  variant="inherit"
                  children={`+ ${item.mission.reward.value} ${t(
                    item.mission.reward.rewardUnit.code
                  )}`}
                  sx={{
                    color: theme.colors.warning.main,
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                />
              </>
            )}

            {item.status ===
              GraphqlTypes.LearningTypes.AssignedMissionStatus.Done && (
              <>
                {/* button */}
                <ButtonCustom
                  variant="contained"
                  color="primary"
                  children={t('Received')}
                  sx={{
                    minWidth: 'unset',
                    p: {
                      xs: theme.spacing(0, 1),
                      md: theme.spacing(0, 1.5),
                    },
                    fontSize: '13px',
                    fontWeight: { xs: 500, md: 700 },
                    lineHeight: '15px',
                    backgroundColor: theme.colors.secondary.light,
                    minHeight: '32px',
                    pointerEvents: 'none',
                  }}
                />

                {/* exp */}
                <Typography
                  variant="inherit"
                  children={`+ ${item.mission.reward.value} ${t(
                    item.mission.reward.rewardUnit.code
                  )}`}
                  sx={{
                    color: theme.colors.secondary.light,
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                />
              </>
            )}
          </Box>
        </Box>
      );
    });
  };
  return <>{renderPersonalAssignedMissions()}</>;
};
export { PersonalAssignedMissions };

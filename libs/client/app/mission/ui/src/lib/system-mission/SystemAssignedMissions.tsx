import { GraphqlTypes } from '@els/client/app/shared/data-access';
import {
  ButtonCustom, LineProgress, LoadingData,
  MissionItemIcon
} from '@els/client/app/shared/ui';
import { addAlpha } from '@els/client/shared/utils';
import {
  Box, Typography,
  useTheme
} from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SystemMissionProps } from '.';

const SystemAssignedMissions: FC<SystemMissionProps> = ({
  getSystemAssignedMissionsLoading,
  systemAssignedMissions,
  doneAssignedMissionLoading,
  handlePerform,
  assignedMissionLoadingIds,
  handleGetRewarded
}) => {
  const {i18n} = useTranslation();
  const { t }: { t: any } = useTranslation();
  const getLanguage = i18n.language;

  const theme = useTheme();
  const renderSystemAssignedMissions = ()=>{
    return systemAssignedMissions?.map((item, index) => {
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
              color="success"
              startIcon={
                <MissionItemIcon
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
              sx={{ mb: 1.5 }}
            >
              <Typography
                variant="inherit"
                children={getLanguage === 'vi' ? t(item.mission.title) : item.mission.titleEn}
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
            </Box>
  
            {/* line process */}
            <Box>
              <LineProgress
                height="12px"
                width="100%"
                allStep={
                  item.missionTarget?.maxProgress ??
                  item.mission.maxProgress
                }
                currentStep={item.currentProgress}
                fullColor={addAlpha(
                  theme.palette.common.black,
                  0.15
                )}
                {...(item.currentProgress <
                  (item.missionTarget?.maxProgress ??
                    item.mission.maxProgress) && {
                  percentColor: theme.colors.info.main,
                })}
                {...(item.currentProgress >=
                  (item.missionTarget?.maxProgress ??
                    item.mission.maxProgress) && {
                  percentColor: theme.colors.success.main,
                })}
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
          </Box>
  
          {/* action */}
          <Box
            sx={{
              textAlign: 'center',
              minWidth: '110px',
            }}
          >
            {item.status ===
              GraphqlTypes.LearningTypes.AssignedMissionStatus
                .InProgress && (
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
              GraphqlTypes.LearningTypes.AssignedMissionStatus
                .Completed && (
              <>
                {/* button */}
                <ButtonCustom
                  variant="contained"
                  color="warning"
                  children={
                    doneAssignedMissionLoading &&
                    assignedMissionLoadingIds[item.id] ? (
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
              GraphqlTypes.LearningTypes.AssignedMissionStatus
                .Done && (
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
  return <>
    {renderSystemAssignedMissions()}
  </>;
};
export { SystemAssignedMissions };

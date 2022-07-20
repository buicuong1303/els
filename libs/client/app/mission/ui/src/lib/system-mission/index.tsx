import { Loading } from '@els/client/app/shared/ui';
import { Box, Divider, styled, Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SystemAssignedMissions } from './SystemAssignedMissions';

const BoxFlexCenter = styled(Box)(
  ({ theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
  `
);

export interface SystemMissionProps {
  getSystemAssignedMissionsLoading: boolean;
  systemAssignedMissions: any[];
  handlePerform: (code: string) => void;
  doneAssignedMissionLoading: boolean;
  assignedMissionLoadingIds: any;
  handleGetRewarded: (data: any) => void;
}
const SystemMission: FC<SystemMissionProps> = ({
  getSystemAssignedMissionsLoading,
  systemAssignedMissions,
  doneAssignedMissionLoading,
  handlePerform,
  assignedMissionLoadingIds,
  handleGetRewarded,
}) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const boxSystemAssignedMissions = () => {
    if (!systemAssignedMissions?.length) {
      return <BoxFlexCenter
        children={t('No records to display')}
        sx={{
          p: theme.spacing(4, 1.5),
          m: 'auto',
        }}
      />;
    }
    return (
      <SystemAssignedMissions
        getSystemAssignedMissionsLoading={getSystemAssignedMissionsLoading}
        systemAssignedMissions={systemAssignedMissions}
        handlePerform={handlePerform}
        doneAssignedMissionLoading={doneAssignedMissionLoading}
        assignedMissionLoadingIds={assignedMissionLoadingIds}
        handleGetRewarded={handleGetRewarded}
      />
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.colors.alpha.white[100],
        boxShadow: theme.colors.shadows.card,
        borderRadius: '6px',
        minHeight: '280px',
        flex: 1,
        ml: {
          xs: 0,
          md: '10px',
        },
        mt: {
          xs: '28px',
          md: 0,
        },
      }}
    >
      {/* header */}
      <Box
        sx={{
          px: '20px',
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="inherit"
          children={t('System missions')}
          sx={{
            fontSize: '16px',
            fontWeight: 700,
          }}
        />
      </Box>

      {/* divider */}
      <Divider
        sx={{
          width: '100%',
          height: '1px',
          color: 'rgba(204, 204, 204, 0.3)',
        }}
      />

      {/* list */}
      <Box position="relative" minHeight="400px">
        {getSystemAssignedMissionsLoading ? (
          <Loading sx={{ position: 'absolute' }} />
        ) : boxSystemAssignedMissions()}
      </Box>
    </Box>
  );
};

export { SystemMission };

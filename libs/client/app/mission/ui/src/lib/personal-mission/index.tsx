/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { BoxNoRecords } from '@els/client/app/mission/feature';
import {
  Loading
} from '@els/client/app/shared/ui';
import {
  Box,
  Divider, Tab,
  Tabs, useTheme
} from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PersonalAssignedMissions } from './PersonalAssignedMissions';
export interface PersonalMissionProps {
  handleChangePersonalMissionOptions: (value: any) => void;
  personalMissionFormState: any;
  personalMissionOptions: any;
  getPersonalAssignedMissionsLoading: boolean;
  personalAssignedMissions: any[];
  language: string;
  handlePerform: (code: string) => void;
  doneAssignedMissionLoading: boolean;
  assignedMissionLoadingIds: any;
  handleGetRewarded: (data: any) => void;
}
const PersonalMission: FC<PersonalMissionProps> = ({
  assignedMissionLoadingIds,
  doneAssignedMissionLoading,
  language,
  personalAssignedMissions,
  getPersonalAssignedMissionsLoading,
  personalMissionOptions,
  personalMissionFormState,
  handlePerform,
  handleGetRewarded,
  handleChangePersonalMissionOptions,
}) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const boxPersonalAssignedMissions = ()=>{
    if(personalAssignedMissions?.length){
      return <PersonalAssignedMissions 
        handleChangePersonalMissionOptions={handleChangePersonalMissionOptions}
        personalMissionFormState={personalMissionFormState}
        personalMissionOptions={personalMissionOptions}
        doneAssignedMissionLoading={doneAssignedMissionLoading} assignedMissionLoadingIds={assignedMissionLoadingIds}
        handleGetRewarded={handleGetRewarded}
        getPersonalAssignedMissionsLoading={getPersonalAssignedMissionsLoading} 
        personalAssignedMissions={personalAssignedMissions} 
        language={language} 
        handlePerform={handlePerform} />;
    }
    return <BoxNoRecords/>;
  };
  return (
    <Box
      sx={{
        backgroundColor: theme.colors.alpha.white[100],
        boxShadow: theme.colors.shadows.card,
        borderRadius: '6px',
        flex: 1,
        mr: {
          xs: 0,
          md: '10px',
        },
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            px: '20px',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Tabs
            onChange={(e, value) => handleChangePersonalMissionOptions(value)}
            value={personalMissionFormState.typeOptions}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '.MuiTabs-indicator': {
                boxShadow: 'unset',
                border: 'unset',
                bgcolor: theme.colors.alpha.white[100],
              },
            }}
          >
            {personalMissionOptions.map((tab: any) => (
              <Tab
                key={tab.value}
                label={t(tab.label)}
                value={tab.value}
                sx={{
                  bgcolor:
                    personalMissionFormState.typeOptions === tab.value
                      ? theme.colors.primary.main
                      : 'unset',
                  boxShadow:
                    personalMissionFormState.typeOptions === tab.value
                      ? '0px 1px 4px rgba(25, 117, 255, 0.25), 0px 3px 12px 2px rgba(25, 117, 255, 0.35)'
                      : 'unset',
                  color:
                    personalMissionFormState.typeOptions === tab.value
                      ? '#ffffff'
                      : 'unset',
                  p: '8px 20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRadius: '6px',
                  textTransform: 'none',
                }}
              />
            ))}
          </Tabs>
        </Box>
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
        {getPersonalAssignedMissionsLoading ? (
          <Loading sx={{ position: 'absolute' }} />
        ) : boxPersonalAssignedMissions()
        }
      </Box>
    </Box>
  );
};

export { PersonalMission };

import { FC, useEffect, Dispatch, SetStateAction } from 'react';

import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Switch, useTheme } from '@mui/material';
import LabelSharpIcon from '@mui/icons-material/LabelSharp';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

import { useTranslation } from 'react-i18next';

import {
  ButtonCustom, LoadingData,
} from '@els/client/app/shared/ui';
import { EquipmentsChecked } from '..';

const BoxWrapper = styled(Box)(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(1)};
    width: 100%;
  `
);

export interface TestOverviewProps {
  equipmentsChecked: EquipmentsChecked;
  setEquipmentsChecked: (equipmentsChecked: EquipmentsChecked) => void;
  start: () => void;
  questionsLoading: boolean;
  inProcess: boolean;
  setInProcess: Dispatch<SetStateAction<boolean>>;
}

export const TestOverview: FC<TestOverviewProps> = (props) => {
  const { equipmentsChecked, setEquipmentsChecked, start, questionsLoading, inProcess, setInProcess } = props;

  const { t }: { t: any } = useTranslation();

  const theme = useTheme();

  // * handle logic
  const handleChangeEquipmentsChecked = (event: any) =>
    setEquipmentsChecked({
      ...equipmentsChecked,
      [event.target.name]: event.target.checked,
    });

  useEffect(() => {
    if (!questionsLoading && inProcess) start();
  }, [questionsLoading, inProcess, start]);

  return (
    <BoxWrapper>
      <Typography
        sx={{
          mt: theme.spacing(5),
          fontSize: '16px',
          fontWeight: 'bold',
        }}
        children={t('General information')}
      />
      <Paper
        elevation={1} variant="elevation"
        sx={{
          mt: theme.spacing(3),
          p: {
            xs: theme.spacing(4, 2),
            md: theme.spacing(4, 8),
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ButtonCustom
            variant="text"
            children={<LabelSharpIcon sx={{ fontSize: '28px', transform: 'scaleX(1.3)' }} />}
            sx={{ p: 0, minWidth: 'unset', mr: theme.spacing(2), backgroundColor: 'unset !important', cursor: 'unset' }}
          />
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
            }}
            children={t('This test will have from x - y questions around listening, speaking, reading and writing skills')}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: theme.spacing(2.5),
          }}
        >
          <ButtonCustom
            variant="text"
            children={<LabelSharpIcon sx={{ fontSize: '28px', transform: 'scaleX(1.3)' }} />}
            sx={{ p: 0, minWidth: 'unset', mr: theme.spacing(2), backgroundColor: 'unset !important', cursor: 'unset' }}
          />
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
            }}
            children={t('The system will automatically update skill points as soon as each question is completed')}
          />
        </Box>
      </Paper>

      <Typography
        sx={{
          mt: {
            xs: theme.spacing(4.5),
            md: theme.spacing(16),
          },
          fontSize: '16px',
          fontWeight: 'bold',
        }}
        children={t('Option')}
      />
      {/* <Typography
        sx={{
          mt: theme.spacing(1),
          color: theme.colors.secondary.light,
        }}
        children={
          <Box>{t('Please select the skill you want to test by toggling')} <b style={{ color: theme.colors.alpha.black[100] }}>{t('one or more')}</b> {t('of the options below')}</Box>
        }
      /> */}
      <Paper
        elevation={1} variant="elevation"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: theme.spacing(3),
          py: {
            xs: 4,
            md: 7,
          },
        }}
      >
        <Grid
          container rowSpacing={{ xs: 2, md: 5 }} columnSpacing={9.5} alignItems="start"
          sx={{
            maxWidth: '800px',
            px: {
              xs: theme.spacing(2),
              sm: theme.spacing(6),
              md: theme.spacing(0),
            }
          }}
        >
          <Grid item xs={12} sm={6} >
            <Box sx={{ display: 'flex', justifyContent: { xs: 'start', sm: 'end' }, alignItems: 'center' }}>
              <Box sx={{ minWidth: '150px' }}>
                <Typography
                  sx={{ fontSize: '16px', fontWeight: '500' }}
                  children={t('Listening exercises')} 
                />
              </Box>
              <Switch color="primary" name="headphone" checked={equipmentsChecked.headphone} onChange={handleChangeEquipmentsChecked} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} >
            <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
              <Box sx={{ minWidth: '150px' }}>
                <Typography
                  sx={{ fontSize: '16px', fontWeight: '500' }}
                  children={t('Speaking exercises')} 
                />
              </Box>
              <Switch color="primary" name="microphone" checked={equipmentsChecked.microphone} onChange={handleChangeEquipmentsChecked} />
            </Box>
          </Grid>
        </Grid>
      </Paper> 

      <Box sx= {{ width: '100%', mt: theme.spacing(14), textAlign: 'center', }}>
        <ButtonCustom
          variant="contained"
          children={(questionsLoading && inProcess) ? t('Loading questions') : t('Start testing') }
          endIcon={(questionsLoading && inProcess) ? <LoadingData /> : <ArrowForwardOutlinedIcon sx={{ fontSize: '25px !important' }} />}
          sx={{
            minWidth: 'unset',
            p: theme.spacing(1.5, 4),
            fontSize: '18px',
            lineHeight: 1,
          }}
          onClick={() => setInProcess(true)}
        />
      </Box>
    </BoxWrapper>
  );
};

export default TestOverview;

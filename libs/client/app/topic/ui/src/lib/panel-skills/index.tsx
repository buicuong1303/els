import { LineChart, LineChartProps } from '@els/client/app/shared/ui';
import { Box, Card, Grid, LinearProgress, MenuItem, Select, Tab, Tabs, Typography, useTheme, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

export interface ChartMemoProps {
  options: any;
  series: any[];
  type: LineChartProps['type'];
  height: string;
}

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
    flex-grow: 1;
    height: 6px;
    
    &.MuiLinearProgress-root {
      background-color: ${theme.colors.alpha.black[10]};
    }
    
    .MuiLinearProgress-bar {
      border-radius: ${theme.general.borderRadiusXl};
    }
  `
);

const ChartMemo: FC<ChartMemoProps> = memo((props) => {
  const { options, series, type, height } = props;

  return (
    <LineChart
      key={Math.random()}
      options={options}
      series={series}
      type={type}
      height={height}
    />
  );
}); 
export interface PanelSkillsProps {
  summarySkill: any;
  handleChangeChartSkill: (value: any) => void;
  chartFormState: any;
  chartStateMemo: any;
  skillTypes: any;
  handleChangeDateOption: (e: any) => void;
  dateOptions: any;
};

const PanelSkills: FC<PanelSkillsProps> = ({summarySkill, handleChangeChartSkill, chartFormState, skillTypes, handleChangeDateOption, chartStateMemo, dateOptions }) => {
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  return (
    <Box sx={{ mb: '28px' }} >
      <Grid container spacing={{ xs: 2, md: '20px' }} alignItems="start">
        {/* skill card */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={{ xs: 2, md: '20px' }} alignItems="start">
            {/* listen */}
            <Grid item xs={6} md={6}>
              <Card
                sx={{
                  p: '20px',
                  boxShadow: theme.colors.shadows.card,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '12px' }}>
                  <img alt="" src={'/images/icon/group-listen.png'} style={{ marginRight: '12px' }} />
                  <Typography children={t('Listening')} sx={{ fontSize: '16px', fontWeight: 700 }}/>
                </Box>
                <Box>
                  <Box sx={{ py: '4px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Typography children={t(summarySkill?.listening < 50 ? 'Bad' : summarySkill?.listening < 70 ? 'Medium' : 'Good')} sx={{ fontSize: '12px', fontWeight: 700 }} />
                    </Box>
                    <LinearProgressWrapper
                      value={summarySkill?.listening ?? 0}
                      color={summarySkill?.listening < 50 ? 'error' : summarySkill?.listening < 70 ? 'warning' : 'success'}
                      variant="determinate"
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* speak */}
            <Grid item xs={6} md={6}>
              <Card
                sx={{
                  p: '20px',
                  boxShadow: theme.colors.shadows.card,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '12px' }}>
                  <img alt="" src={'/images/icon/group-speak.png'} style={{ marginRight: '12px' }} />
                  <Typography children={t('Speaking')} sx={{ fontSize: '16px', fontWeight: 700 }}/>
                </Box>
                <Box>
                  <Box sx={{ py: '4px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Typography children={t(summarySkill?.speaking < 50 ? 'Bad' : summarySkill?.speaking < 70 ? 'Medium' : 'Good')} sx={{ fontSize: '12px', fontWeight: 700 }} />
                    </Box>
                    <LinearProgressWrapper
                      value={summarySkill?.speaking ?? 0}
                      color={summarySkill?.speaking < 50 ? 'error' : summarySkill?.speaking < 70 ? 'warning' : 'success'}
                      variant="determinate"
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* read */}
            <Grid item xs={6} md={6}>
              <Card
                sx={{
                  p: '20px',
                  boxShadow: theme.colors.shadows.card,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '12px' }}>
                  <img alt="" src={'/images/icon/group-read.png'} style={{ marginRight: '12px' }} />
                  <Typography children={t('Reading')} sx={{ fontSize: '16px', fontWeight: 700 }}/>
                </Box>
                <Box>
                  <Box sx={{ py: '4px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Typography children={t(summarySkill?.reading < 50 ? 'Bad' : summarySkill?.reading < 70 ? 'Medium' : 'Good')} sx={{ fontSize: '12px', fontWeight: 700 }} />
                    </Box>
                    <LinearProgressWrapper
                      value={summarySkill?.reading ?? 0}
                      color={summarySkill?.reading < 50 ? 'error' : summarySkill?.reading < 70 ? 'warning' : 'success'}
                      variant="determinate"
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* write */}
            <Grid item xs={6} md={6}>
              <Card
                sx={{
                  p: '20px',
                  boxShadow: theme.colors.shadows.card,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '12px' }}>
                  <img alt="" src={'/images/icon/group-write.png'} style={{ marginRight: '12px' }} />
                  <Typography children={t('Writing')} sx={{ fontSize: '16px', fontWeight: 700 }}/>
                </Box>
                <Box>
                  <Box sx={{ py: '4px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Typography children={t(summarySkill?.writing < 50 ? 'Bad' : summarySkill?.writing < 70 ? 'Medium' : 'Good')} sx={{ fontSize: '12px', fontWeight: 700 }} />
                    </Box>
                    <LinearProgressWrapper
                      value={summarySkill?.writing ?? 0}
                      color={summarySkill?.writing < 50 ? 'error' : summarySkill?.writing < 70 ? 'warning' : 'success'}
                      variant="determinate"
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* skill chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: '15px',
              pb: 0,
              boxShadow: theme.colors.shadows.card,
              height: '276px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* action */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Tabs
                  onChange={(e, value) => handleChangeChartSkill(value)}
                  value={chartFormState.skill}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{
                    '.MuiTabs-indicator': {
                      boxShadow: 'unset',
                      border: 'unset',
                      bgcolor: theme.colors.alpha.white[100],
                    }
                  }}
                >
                  {skillTypes.map((tab: any) => (
                    <Tab
                      key={tab.value} label={t(tab.label)} value={tab.value}
                      sx={{
                        bgcolor: chartFormState.skill ===  tab.value ? theme.colors.primary.main : 'unset',
                        boxShadow: chartFormState.skill ===  tab.value ? '0px 1px 4px rgba(25, 117, 255, 0.25), 0px 3px 12px 2px rgba(25, 117, 255, 0.35)' : 'unset',
                        color: chartFormState.skill ===  tab.value ? '#ffffff' : 'unset',
                        p: '8px 20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: '6px',
                      }}
                    />
                  ))}
                </Tabs>
              </Box>

              <Box>
                <FormControl
                  variant="outlined"
                  sx={{
                    m: 1,
                    minWidth: 120,
                    '&:hover': {
                      '.MuiSelect-select': {
                        backgroundColor: theme.colors.primary.lighter,
                      },
                    },
                    'fieldset': {
                      border: 'unset !important',
                    },
                    '.MuiInputBase-input': {
                      p: '8px',
                      color: theme.colors.primary.main,
                    },
                    '.MuiSvgIcon-root': {
                      color: theme.colors.primary.main,
                      'path': {
                        d: 'path("M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z")',
                      }
                    }
                  }}
                >
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={chartFormState.dateOption}
                    onChange={handleChangeDateOption}
                    sx={{
                      p: 0
                    }}
                  >
                    {dateOptions.map((item: any) => {
                      return (
                        <MenuItem key={item.value} value={item.value}>{t(item.label)}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* chart */}
            <Box sx={{ flex: 1 }}>
              <ChartMemo
                options={chartStateMemo.options}
                series={chartStateMemo.series}
                type="line"
                height={'100%'}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export { PanelSkills };

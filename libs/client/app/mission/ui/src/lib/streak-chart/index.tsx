import { SettingOptions } from '@els/client/app/setting/feature';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { ApexChartsCustom, ApexChartsCustomProps, ButtonCustom, LoadingData, StreakIcon } from '@els/client/app/shared/ui';
import { Box, Divider, Typography, useTheme } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import { cloneDeep } from 'lodash';
import { FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface StreakChartProps {
  currentUser: GraphqlTypes.LearningTypes.User | undefined;
  getCurrentUserLoading: boolean;
  goToSettingPage: (data: any) => void;
  chartStateMemo: any;
}
export interface ChartMemoProps {
  options: ApexOptions;
  series: ApexOptions['series'];
  type: ApexChartsCustomProps['type'];
  height: string;
}
interface ChartDataItemType {
  value: number;
  label: string;
}



const ChartMemo: FC<ChartMemoProps> = memo((props) => {
  const { options, series, type, height } = props;

  return (
    <ApexChartsCustom
      key={Math.random()}
      options={options}
      series={series}
      type={type}
      height={height}
    />
  );
});

const StreakChart: FC<StreakChartProps> = ({ currentUser, goToSettingPage, getCurrentUserLoading, chartStateMemo }) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const boxSize = useMemo(() => {
    const boxLength = chartStateMemo?.series?.[1]?.data?.length;
    if (boxLength <= 15) {
      return {
        width: '50%',
        height: '6px'
      };
    } else if (boxLength <= 20) {
      return {
        width: '60%',
        height: '5px'
      };
    } else if (boxLength <= 25) {
      return {
        width: '70%',
        height: '3px'
      };
    } else {
      return {
        width: '80%',
        height: '2px'
      };
    }
  }, [chartStateMemo]);

  const isCurrentUserLoading = ()=>{
    if(getCurrentUserLoading){
      return (
        <LoadingData />
      );
    }else{
      if(!currentUser?.extraInfo?.currentStreakList?.streaks?.length){
        return 0;
      }
      return currentUser?.extraInfo?.currentStreakList?.streaks?.length;
    }
  };


  // render ui
  return (
    <Box
      sx={{
        backgroundColor: theme.colors.alpha.white[100],
        boxShadow: theme.colors.shadows.card,
        borderRadius: '6px',
        minHeight: '280px',
        flex: '1 1 50%',
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
          children={t('Streak')}
          sx={{
            fontSize: '16px',
            fontWeight: 700,
          }}
        />
        <Typography
          variant="subtitle1"
          children={t('Change the target')}
          sx={{
            fontSize: '18px',
            fontWeight: 400,
            color: theme.colors.primary.main,
            cursor: 'pointer',
            ':hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={() => goToSettingPage({ tab: SettingOptions.TargetSetting })}
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

      <Box
        display="flex"
        alignItems="center"
        mx={{ xs: 2, sm: 3, md: 2, lg: 6 }}
      >
        {/* max streak */}
        <Box mr={{ xs: '20px' }}>
          <ButtonCustom
            variant="contained"
            color="warning"
            children={isCurrentUserLoading()}
            sx={{
              backgroundImage: theme.colors.gradients[4],
              borderRadius: '50%',
              minWidth: 'unset',
              width: '60px',
              height: '60px',
              pointerEvents: 'none',
              fontWeight: 600,
              fontSize: '32px',
              lineHeight: '38px',
              boxShadow: theme.colors.shadows.card,
            }}
          />
        </Box>

        {/* chart group */}
        <Box flex="1">
          {/* chart */}
          <ChartMemo
            type="bar"
            height="200px"
            options={chartStateMemo.options}
            series={chartStateMemo?.series}
          />

          {/* streak line */}
          {!!chartStateMemo?.series?.[1]?.data && (
            <Box
              sx={{
                display: 'flex',
                pl: '45px',
                pr: '10px',
                mt: '-20px',
                mb: { xs: '20px', sm: '32px', md: '20px', lg: '32px' },
              }}
            >
              {cloneDeep(chartStateMemo?.series?.[1]?.data ?? []).map(
                (item: ChartDataItemType, index: number) => {
                  const getBackgroundImage = () => {
                    if (index === 0) {
                      return '#ffffff00';
                    } else {
                      if (chartStateMemo?.series?.[0]?.data?.[index] > 0 && chartStateMemo?.series?.[0]?.data?.[index] >= item) {
                        return theme.colors.gradients[4];
                      }
                      return `linear-gradient(${theme.colors.secondary.light}, ${theme.colors.secondary.light}) !important`;
                    }
                  };
                  return (
                    <Box
                      key={`${item}-${index}`}
                      sx={{
                        zIndex:
                                chartStateMemo?.series?.[1]?.data?.length -
                                index,
                        position: 'relative',
                        height: boxSize.height,
                        flex: 1,
                        left: 0,
                        transform: 'translate(-50%, 0)',
                        backgroundImage: {getBackgroundImage}
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'inline-block',
                          left: '100%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width:boxSize.width,
                          maxWidth: {
                            xs: '36px',
                            sm: '44px',
                            md: '36px',
                            lg: '44px',
                          },
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
                                width: '80%',
                                maxWidth: {
                                  xs: '20px',
                                  sm: '18px',
                                  md: '20px',
                                  lg: '28px',
                                },
                                height: '80%',
                                maxHeight: {
                                  xs: '20px',
                                  sm: '18px',
                                  md: '20px',
                                  lg: '28px',
                                },
                                position: 'relative',
                                left: '50%',
                                transform: 'translate(-50%, 0%)',
                              }}
                            />
                          }
                          sx={{
                            position: 'absolute',
                            p: 0,
                            backgroundImage: `${
                              chartStateMemo?.series?.[0]?.data?.[index] >
                                      0 &&
                                    chartStateMemo?.series?.[0]?.data?.[
                                      index
                                    ] >= item
                                ? theme.colors.gradients[4]
                                : 'linear-gradient(' +
                                        theme.colors.secondary.light +
                                        ', ' +
                                        theme.colors.secondary.light +
                                        ')'
                            } !important`,
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
                      </Box>
                    </Box>
                  );
                }
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export { StreakChart };


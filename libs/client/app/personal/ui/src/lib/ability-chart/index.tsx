import React, { FC } from 'react';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { Loading, RadarChart } from '@els/client/app/shared/ui';
import { addAlpha } from '@els/client/shared/utils';

export interface AbilityChartProps {
  categorySelectedId: string;
  categories: any[];
  handleChangeCategoryOption: (event: any) => void;
  chartState: any;
  loadingGetCapacityChartDataOfCurrentUser: any;
  loadingGetCapacityChartDataOfAnyUser: any;
  categorySelectedIdRef: any;
}
const AbilityChart: FC<AbilityChartProps> = ({
  categorySelectedIdRef,
  loadingGetCapacityChartDataOfAnyUser,
  loadingGetCapacityChartDataOfCurrentUser,
  categorySelectedId,
  categories,
  handleChangeCategoryOption,
  chartState,
}) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  return (
    <>
      <Typography
        variant="inherit"
        children={t('Capacity chart')}
        sx={{
          fontSize: '16px',
          fontWeight: 700,
          mb: 1,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: {
            xs: 500,
            sm: 500,
            md: 500,
            lg: 600,
            xl: 650,
          },
          borderRadius: '6px',
          backgroundImage: theme.colors.gradients[1],
          // background: theme.colors.primary.main,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <FormControl
            variant="outlined"
            sx={{
              minWidth: 170,
              fontSize: '12px',
              fontWeight: 500,
              fieldset: {
                border: 'unset !important',
              },
              '.MuiInputBase-input': {
                p: '0px',
                color: '#ffffff',
              },
              '.MuiSvgIcon-root': {
                color: '#ffffff',
                mt: '2px',
                p: '2px',
                path: {
                  d: 'path("M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z")',
                },
              },
            }}
          >
            <Select
              value={categorySelectedId}
              onChange={handleChangeCategoryOption}
              sx={{
                p: 0,
              }}
              MenuProps={{
                anchorOrigin: {
                  horizontal: 'center',
                  vertical: 'bottom',
                },
              }}
            >
              {cloneDeep(categories).map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <RadarChart
            rest={{
              className: 'capacity-chart',
            }}
            options={chartState.options}
            series={chartState.series}
            type="radar"
            height={
              categories[
                categories.findIndex(
                  (item) => item.id === categorySelectedIdRef.current
                )
              ]?.name === 'Giao tiếp thông dụng'
                ? '110%'
                : '100%'
            }
          />
        </Box>

        {(loadingGetCapacityChartDataOfCurrentUser ||
          loadingGetCapacityChartDataOfAnyUser) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: addAlpha('#ffffff', 0.5),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loading sx={{ position: 'absolute', mt: '10px' }} />
          </Box>
        )}
      </Box>
    </>
  );
};

export { AbilityChart };

/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ApexCharts } from '@els/client/shared/components';
import { SxProps } from '@mui/system';

export interface RadarChartProps {
  options?: any;
  series?: any[];
  type?: 'area' | 'line' | 'bar' | 'histogram' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'treemap' | 'boxPlot' | 'candlestick' | 'radar' | 'polarArea' | 'rangeBar' | undefined;
  width?: string | number;
  height?: string | number;
  style?: SxProps;
  rest?: any;
}

const RadarChart = (props: RadarChartProps) => {
  const { options, series, type, width, height, style, rest } = props;

  return (
    <ApexCharts
      options={options ?? {}}
      series={series ?? []}
      type={type ?? 'line'}
      height={height ?? '100%'}
      width={width ?? '100%'}
      style={{ width: width ?? '100%', ...style }}
      {...rest}
    />
  );
};

export { RadarChart };

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ApexCharts } from '@els/client/shared/components';
import { ApexOptions } from 'apexcharts';

export interface ApexChartsCustomProps {
  options?: ApexOptions;
  series?: ApexOptions['series'];
  type?: 'area' | 'line' | 'bar' | 'histogram' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'treemap' | 'boxPlot' | 'candlestick' | 'radar' | 'polarArea' | 'rangeBar' | undefined;
  width?: string | number;
  height?: string | number;
  id?: any;
}

const ApexChartsCustom = (props: ApexChartsCustomProps) => {
  const { options, series, type, width, height, id } = props;

  return <ApexCharts id={id} options={options ?? {}} series={series ?? []} type={type ?? 'line'} height={height ?? '100%'} width={width ?? '100%'} />;
};

export { ApexChartsCustom };

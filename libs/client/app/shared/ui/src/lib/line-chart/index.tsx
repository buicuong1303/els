/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ApexCharts } from "@els/client/shared/components";

export interface LineChartProps {
  options?: any;
  series?: any[];
  type?: "area" | "line" | "bar" | "histogram" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "treemap" | "boxPlot" | "candlestick" | "radar" | "polarArea" | "rangeBar" | undefined;
  width?: string | number;
  height?: string | number;
  id?: any;
}

const LineChart = (props: LineChartProps) => {
  const { options, series, type, width, height, id } = props;

  return <ApexCharts id={id} options={options ?? {}} series={series ?? []} type={type ?? 'line'} height={height ?? '100%'} width={width ?? '100%'} />;
}

export { LineChart };

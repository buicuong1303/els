import dynamic from 'next/dynamic';

export const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

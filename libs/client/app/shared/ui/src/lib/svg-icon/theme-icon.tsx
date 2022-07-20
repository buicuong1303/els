/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const ThemeIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;

  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.3" d="M6 13.59C6 15.19 6.62 16.69 7.76 17.83C8.89 18.97 10.4 19.59 12 19.59V5.09998L7.76 9.34998C6.62 10.48 6 11.99 6 13.59Z" fill="#6E759F"/>
      <path d="M17.66 7.93002L12 2.27002L6.34 7.93002C3.22 11.05 3.22 16.12 6.34 19.24C7.9 20.8 9.95 21.58 12 21.58C14.05 21.58 16.1 20.8 17.66 19.24C20.78 16.12 20.78 11.05 17.66 7.93002ZM12 19.59C10.4 19.59 8.89 18.97 7.76 17.83C6.62 16.69 6 15.19 6 13.59C6 11.99 6.62 10.48 7.76 9.35002L12 5.10002V19.59Z" fill="white"/>
    </SvgIcon>
  );
};

export { ThemeIcon };

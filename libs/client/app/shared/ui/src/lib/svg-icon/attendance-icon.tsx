/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const AttendanceIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path d="M22 5.18L10.59 16.6L6.35 12.36L7.76 10.95L10.59 13.78L20.59 3.78L22 5.18ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C13.57 4 15.04 4.46 16.28 5.25L17.73 3.8C16.1 2.67 14.13 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.73 22 15.36 21.56 16.78 20.78L15.28 19.28C14.28 19.74 13.17 20 12 20ZM19 15H16V17H19V20H21V17H24V15H21V12H19V15Z" fill={color} />
    </SvgIcon>
  );
};

export { AttendanceIcon };
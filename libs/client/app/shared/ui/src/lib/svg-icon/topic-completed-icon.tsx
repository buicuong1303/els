/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const TopicCompletedIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.3" d="M20 18H4V6H9.17L11.17 8H20V18ZM18 12H6V10H18V12ZM14 16H6V14H14V16Z" fill="white"/>
      <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20.77C21.45 20 22 19.44 22 18.77V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM18 12H6V10H18V12ZM14 16H6V14H14V16Z" fill="white"/>
    </SvgIcon>
  );
};

export { TopicCompletedIcon };

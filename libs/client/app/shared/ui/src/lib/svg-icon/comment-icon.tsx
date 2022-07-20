/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const CommentIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.3" d="M4 17.17L4.59 16.58L5.17 16H20V4H4V17.17ZM18 14H10.5L12.5 12H18V14ZM6 11.53L11.88 5.65C12.08 5.45 12.39 5.45 12.59 5.65L14.36 7.42C14.56 7.62 14.56 7.93 14.36 8.13L8.47 14H6V11.53Z" fill={color} />
      <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4.58 16.59L4 17.17V4H20V16ZM10.5 14H18V12H12.5L10.5 14ZM14.36 8.13C14.56 7.93 14.56 7.62 14.36 7.42L12.59 5.65C12.39 5.45 12.08 5.45 11.88 5.65L6 11.53V14H8.47L14.36 8.13Z" fill={color} />
    </SvgIcon>
  );
};

export { CommentIcon };

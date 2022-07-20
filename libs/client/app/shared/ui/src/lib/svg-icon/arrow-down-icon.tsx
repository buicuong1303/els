/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const ArrowDownIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path d="M7.91 15.91L12.5 11.33L17.09 15.91L18.5 14.5L12.5 8.5L6.5 14.5L7.91 15.91Z" fill={color} />
    </SvgIcon>
  );
};

export { ArrowDownIcon };

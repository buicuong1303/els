/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const ListIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <g opacity="0.3">
        <path opacity="0.3" d="M20 4V8H4V4H20ZM20 10V14H4V10H20ZM4 20V16H20V20H4Z" />
      </g>
      <path d="M2 2V22H22V2H2ZM20 4V8H4V4H20ZM20 10V14H4V10H20ZM4 20V16H20V20H4Z" />
    </SvgIcon>
  );
};

export { ListIcon };
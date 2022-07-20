/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const InfoIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color || '#33C2FF', ...sx }}>
      <path d="M10.5 5.25C10.5 5.64782 10.658 6.02936 10.9393 6.31066C11.2206 6.59196 11.6022 6.75 12 6.75C12.3978 6.75 12.7794 6.59196 13.0607 6.31066C13.342 6.02936 13.5 5.64782 13.5 5.25C13.5 4.85218 13.342 4.47064 13.0607 4.18934C12.7794 3.90804 12.3978 3.75 12 3.75C11.6022 3.75 11.2206 3.90804 10.9393 4.18934C10.658 4.47064 10.5 4.85218 10.5 5.25V5.25ZM12.75 9.1875H11.25C11.1469 9.1875 11.0625 9.27187 11.0625 9.375V20.25C11.0625 20.3531 11.1469 20.4375 11.25 20.4375H12.75C12.8531 20.4375 12.9375 20.3531 12.9375 20.25V9.375C12.9375 9.27187 12.8531 9.1875 12.75 9.1875Z" fill={color} />
    </SvgIcon>
  );
};

export { InfoIcon };

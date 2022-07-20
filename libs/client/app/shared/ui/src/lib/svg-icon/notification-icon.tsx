/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const NotificationIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.3" d="M12 7.33984C9.51 7.33984 8 9.35984 8 11.8398V17.8398H16V11.8398C16 9.35984 14.49 7.33984 12 7.33984Z" fill={color} />
      <path d="M12 22.8398C13.1 22.8398 14 21.9398 14 20.8398H10C10 21.9398 10.9 22.8398 12 22.8398ZM18 16.8398V11.8398C18 8.76984 16.37 6.19984 13.5 5.51984V4.83984C13.5 4.00984 12.83 3.33984 12 3.33984C11.17 3.33984 10.5 4.00984 10.5 4.83984V5.51984C7.64 6.19984 6 8.75984 6 11.8398V16.8398L4 18.8398V19.8398H20V18.8398L18 16.8398ZM16 17.8398H8V11.8398C8 9.35984 9.51 7.33984 12 7.33984C14.49 7.33984 16 9.35984 16 11.8398V17.8398Z" fill={color} />
    </SvgIcon>
  );
};

export { NotificationIcon };

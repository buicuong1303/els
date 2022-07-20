/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const PersonalIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.3" d="M12 16.4092C9.31 16.4092 6.23 17.6892 6 18.4092H18C17.8 17.6992 14.7 16.4092 12 16.4092Z" fill={color} />
      <path opacity="0.3" d="M12 10.4092C13.1046 10.4092 14 9.51375 14 8.40918C14 7.30461 13.1046 6.40918 12 6.40918C10.8954 6.40918 10 7.30461 10 8.40918C10 9.51375 10.8954 10.4092 12 10.4092Z" fill={color} />
      <path d="M12 14.4092C9.33 14.4092 4 15.7492 4 18.4092V20.4092H20V18.4092C20 15.7492 14.67 14.4092 12 14.4092ZM6 18.4092C6.22 17.6892 9.31 16.4092 12 16.4092C14.7 16.4092 17.8 17.6992 18 18.4092H6ZM12 12.4092C14.21 12.4092 16 10.6192 16 8.40918C16 6.19918 14.21 4.40918 12 4.40918C9.79 4.40918 8 6.19918 8 8.40918C8 10.6192 9.79 12.4092 12 12.4092ZM12 6.40918C13.1 6.40918 14 7.30918 14 8.40918C14 9.50918 13.1 10.4092 12 10.4092C10.9 10.4092 10 9.50918 10 8.40918C10 7.30918 10.9 6.40918 12 6.40918Z" fill={color} />
    </SvgIcon>
  );
};

export { PersonalIcon };

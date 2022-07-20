/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const BookIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path d="M3 5V19C3 21.201 4.794 22 6 22H21V20H6.012C5.55 19.988 5 19.806 5 19C5 18.194 5.55 18.012 6.012 18H21V4C21 2.897 20.103 2 19 2H6C4.794 2 3 2.799 3 5Z" />
    </SvgIcon>
  );
};

export { BookIcon };

/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const StartRatingIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.3" d="M12.94 12L12 8.89L11.06 12H8.23999L10.51 13.62L9.57999 16.63L12 14.79L14.42 16.63L13.49 13.62L15.76 12H12.94Z" />
      <path d="M22 10H14.42L12 2L9.58 10H2L8.17 14.41L5.83 22L12 17.31L18.17 22L15.82 14.41L22 10ZM14.42 16.63L12 14.79L9.58 16.63L10.51 13.62L8.24 12H11.06L12 8.89L12.94 12H15.76L13.49 13.62L14.42 16.63Z" />
    </SvgIcon>
  );
};

export { StartRatingIcon };

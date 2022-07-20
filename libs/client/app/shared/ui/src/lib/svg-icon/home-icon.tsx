/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const HomeIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path d="M12 3.5L2 12.5H5V20.5H11V14.5H13V20.5H19V12.5H22L12 3.5ZM17 18.5H15V12.5H9V18.5H7V10.69L12 6.19L17 10.69V18.5Z" fill={color} />
      <path opacity="0.3" d="M7 10.69V18.5H9V12.5H15V18.5H17V10.69L12 6.19L7 10.69Z" fill={color} />
    </SvgIcon>
  );
};

export { HomeIcon };

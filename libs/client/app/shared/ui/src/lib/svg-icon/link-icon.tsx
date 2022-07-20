/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const LinkIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.87" d="M17 7.88477H13V9.88477H17C18.65 9.88477 20 11.2348 20 12.8848C20 14.5348 18.65 15.8848 17 15.8848H13V17.8848H17C19.76 17.8848 22 15.6448 22 12.8848C22 10.1248 19.76 7.88477 17 7.88477ZM11 15.8848H7C5.35 15.8848 4 14.5348 4 12.8848C4 11.2348 5.35 9.88477 7 9.88477H11V7.88477H7C4.24 7.88477 2 10.1248 2 12.8848C2 15.6448 4.24 17.8848 7 17.8848H11V15.8848ZM8 11.8848H16V13.8848H8V11.8848Z" fill={color} />
    </SvgIcon>
  ); 
};

export { LinkIcon };

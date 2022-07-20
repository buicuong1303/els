/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const LikeIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.3" d="M20.75 14.0001V12.5001H14L15.005 8.49512L11.75 11.7501V19.2501H18.5L20.75 14.0001Z" fill="white"/>
      <path d="M11.75 20.75H18.5C19.1225 20.75 19.655 20.375 19.88 19.835L22.145 14.5475C22.2125 14.375 22.25 14.195 22.25 14V12.5C22.25 11.675 21.575 11 20.75 11H16.0175L16.73 7.5725L16.7525 7.3325C16.7525 7.025 16.625 6.74 16.4225 6.5375L15.6275 5.75L10.685 10.6925C10.415 10.9625 10.25 11.3375 10.25 11.75V19.25C10.25 20.075 10.925 20.75 11.75 20.75ZM11.75 11.75L15.005 8.495L14 12.5H20.75V14L18.5 19.25H11.75V11.75ZM5.75 11.75H8.75V20.75H5.75V11.75Z" fill="white"/>
    </SvgIcon>
  );
};

export { LikeIcon };
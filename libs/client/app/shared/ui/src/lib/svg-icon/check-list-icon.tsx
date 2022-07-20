/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const CheckListIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.3" d="M4 19H20V5H4V19ZM13.41 10.75L14.82 12.17L17.99 9L19.41 10.42L14.82 15L12 12.16L13.41 10.75ZM5 7H10V9H5V7ZM5 11H10V13H5V11ZM5 15H10V17H5V15Z" fill="#ffffff"/>
      <path d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM20 19H4V5H20V19Z" fill="#ffffff"/>
      <path d="M19.41 10.42L17.99 9L14.82 12.17L13.41 10.75L12 12.16L14.82 15L19.41 10.42Z" fill="#ffffff"/>
      <path d="M10 7H5V9H10V7Z" fill="#ffffff"/>
      <path d="M10 11H5V13H10V11Z" fill="#ffffff"/>
      <path d="M10 15H5V17H10V15Z" fill="#ffffff"/>
    </SvgIcon>
  );
};

export { CheckListIcon };
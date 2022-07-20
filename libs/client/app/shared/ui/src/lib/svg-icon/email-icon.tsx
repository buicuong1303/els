/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const EmailIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path opacity="0.3" d="M20 8.88477L12 13.8848L4 8.88477V18.8848H20V8.88477ZM20 6.88477H4L12 11.8748L20 6.88477Z" fill={color} />
      <path d="M4 20.8848H20C21.1 20.8848 22 19.9848 22 18.8848V6.88477C22 5.78477 21.1 4.88477 20 4.88477H4C2.9 4.88477 2 5.78477 2 6.88477V18.8848C2 19.9848 2.9 20.8848 4 20.8848ZM20 6.88477L12 11.8748L4 6.88477H20ZM4 8.88477L12 13.8848L20 8.88477V18.8848H4V8.88477Z" fill={color} />
    </SvgIcon>
  ); 
};

export { EmailIcon };

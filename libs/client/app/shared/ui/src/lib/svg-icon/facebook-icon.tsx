/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const FacebookIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <rect width="24" height="24" transform="translate(0.5 0.339844)" fill="#395185"/>
      <path d="M17.0594 24.3401V15.046H20.1792L20.6462 11.424H17.0594V9.11134C17.0594 8.06266 17.3507 7.348 18.8546 7.348L20.7726 7.34716V4.10762C20.4407 4.06347 19.3022 3.96484 17.9777 3.96484C15.2123 3.96484 13.3191 5.65281 13.3191 8.75275V11.424H10.1914V15.046H13.3191V24.3401H17.0594Z" fill="white"/>
    </SvgIcon>
  );
};

export { FacebookIcon };

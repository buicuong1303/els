/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const SearchIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path d="M15.5 14.5H14.71L14.43 14.23C15.41 13.09 16 11.61 16 10C16 6.41 13.09 3.5 9.5 3.5C5.91 3.5 3 6.41 3 10C3 13.59 5.91 16.5 9.5 16.5C11.11 16.5 12.59 15.91 13.73 14.93L14 15.21V16L19 20.99L20.49 19.5L15.5 14.5V14.5ZM9.5 14.5C7.01 14.5 5 12.49 5 10C5 7.51 7.01 5.5 9.5 5.5C11.99 5.5 14 7.51 14 10C14 12.49 11.99 14.5 9.5 14.5Z" />
    </SvgIcon>
  );
};

export { SearchIcon };
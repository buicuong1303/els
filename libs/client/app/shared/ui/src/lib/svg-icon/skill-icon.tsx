/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const SkillIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color, ...sx }}>
      <path d="M2 20.49L9.5 12.98L13.5 16.98L20.59 9.01L22 10.42L13.5 19.98L9.5 15.98L3.5 21.99L2 20.49ZM3.5 15.99L9.5 9.98L13.5 13.98L22 4.42L20.59 3.01L13.5 10.98L9.5 6.98L2 14.49L3.5 15.99Z" />
    </SvgIcon>
  );
};

export { SkillIcon };

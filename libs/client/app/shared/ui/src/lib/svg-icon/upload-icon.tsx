/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const UploadIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color || 'white', ...sx }}>
      <path opacity="0.3" d="M9.83008 8.00008H11.0001V14.0001H13.0001V8.00008H14.1701L12.0001 5.83008L9.83008 8.00008Z" fill={color} />
      <path d="M12 3L5 10H9V16H15V10H19L12 3ZM13 8V14H11V8H9.83L12 5.83L14.17 8H13ZM5 18H19V20H5V18Z" fill={color} />
    </SvgIcon>
  );
};

export { UploadIcon };

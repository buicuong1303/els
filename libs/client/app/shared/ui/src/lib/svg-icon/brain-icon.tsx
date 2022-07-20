/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  bgcolor?: string;
  sx?: SxProps;
}

const BrainIcon = (props: SvgIconProps) => {
  const { width, height, bgcolor, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: bgcolor, ...sx }}>
      <path d="M9.51788 22C9.02788 20.402 8.28888 19.211 7.30038 18.4265C5.81788 17.25 3.46238 17.9815 2.59238 16.7675C1.72238 15.5535 3.20188 13.3215 3.72088 12.0045C4.24038 10.6875 1.73088 10.222 2.02388 9.84797C2.21888 9.59847 3.48738 8.87947 5.82838 7.68997C6.49338 3.89647 8.94988 1.99997 13.1989 1.99997C19.5719 1.99997 21.9999 7.40297 21.9999 10.84C21.9999 14.2765 19.0599 17.9785 14.8719 18.777C14.4974 19.322 15.0374 20.397 16.4919 22.0005" stroke={color} strokeWidth="2.3335" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.74991 7.24997C9.42291 8.51697 9.51991 9.40697 10.0414 9.91897C10.5624 10.4315 11.4504 10.7665 12.7054 10.924C12.4204 12.559 12.7679 13.3255 13.7469 13.2245C14.7259 13.1235 15.3144 12.717 15.5119 12.0045C17.0419 12.4345 17.8714 12.0745 17.9999 10.9245C18.1924 9.19947 17.2624 7.82397 16.8809 7.82397C16.4999 7.82397 15.5119 7.77747 15.5119 7.24997C15.5119 6.72247 14.3579 6.42497 13.3164 6.42497C12.2749 6.42497 12.9014 5.72247 11.4714 5.99997C10.5179 6.18497 9.94391 6.60147 9.74991 7.24997V7.24997Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M15.2498 12.75C14.7413 13.0655 14.0438 13.59 13.7498 14C13.0153 15.025 12.4198 15.6485 12.2898 16.304" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </SvgIcon>
  );
};

export { BrainIcon };


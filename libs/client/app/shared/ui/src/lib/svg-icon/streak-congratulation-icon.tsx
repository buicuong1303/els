/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  sx?: SxProps;
}

const StreakCongratulationIcon = (props: SvgIconProps) => {
  const { width, height, color, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '24px', height: height || '24px', color: color || 'white', ...sx }}>
      <path opacity="0.3" d="M15.26 15.0605V15.0684L15.2602 15.0763C15.2945 16.1567 14.7223 17.1477 13.8595 17.6144C13.1908 17.9762 12.288 18.0516 11.2736 17.5058C12.3064 16.955 12.8822 16.0321 13.0682 15.1782C13.1675 14.7333 13.1384 14.3068 13.0717 13.9073C13.0313 13.6653 12.9696 13.3994 12.9104 13.1439C12.8775 13.0019 12.8453 12.8632 12.8179 12.7334C12.7353 12.3421 12.6725 11.9402 12.6825 11.5067C12.7031 11.5335 12.7238 11.56 12.7448 11.5863C13.0409 11.9581 13.3978 12.3141 13.7319 12.6472C13.7856 12.7007 13.8387 12.7536 13.8908 12.806C14.6946 13.6123 15.26 14.2733 15.26 15.0605Z" fill="url(#paint0_linear_1203_9248)" stroke="white"/>
      <path d="M19.48 12.3501C17.91 8.27014 12.32 8.05014 13.67 2.12014C13.77 1.68014 13.3 1.34014 12.92 1.57014C9.29 3.71014 6.68 8.00014 8.87 13.6201C9.05 14.0801 8.51 14.5101 8.12 14.2101C6.31 12.8401 6.12 10.8701 6.28 9.46014C6.34 8.94014 5.66 8.69014 5.37 9.12014C4.69 10.1601 4 11.8401 4 14.3701C4.38 19.9701 9.11 21.6901 10.81 21.9101C13.24 22.2201 15.87 21.7701 17.76 20.0401C19.84 18.1101 20.6 15.0301 19.48 12.3501ZM10.2 17.3801C11.64 17.0301 12.38 15.9901 12.58 15.0701C12.91 13.6401 11.62 12.2401 12.49 9.98014C12.82 11.8501 15.76 13.0201 15.76 15.0601C15.84 17.5901 13.1 19.7601 10.2 17.3801Z" fill="url(#paint0_linear_1203_9248)"/>

      <linearGradient id="paint0_linear_1203_9248" x1="0" y1="0" x2="58.9175" y2="46.7419" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FCCF31"/>
        <stop offset="1" stopColor="#F55555"/>
      </linearGradient>
    </SvgIcon>
  );
};

export { StreakCongratulationIcon };

/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIcon } from '@mui/material';
import { SxProps } from '@mui/system';

interface SvgIconProps {
  width?: any;
  height?: any;
  color?: string;
  backgroundColor?: string;
  sx?: SxProps;
}

const DoneIcon = (props: SvgIconProps) => {
  const { width, height, color, backgroundColor, sx } = props;
  
  return (
    <SvgIcon sx={{ width: width || '40px', height: height || '40px', color: color || '#39AB04', backgroundColor: backgroundColor || '#ECFBE6', ...sx }}>
      <g filter="url(#filter0_dd_667_5184)">
        <rect x="16.0083" y="7" width="24" height="24" rx="12" fill={backgroundColor}/>
        <path d="M25.5082 22.5L22.0082 19L20.8416 20.1666L25.5082 24.8333L35.5082 14.8333L34.3416 13.6666L25.5082 22.5Z" fill={color}/>
      </g>
      <defs>
        <filter id="filter0_dd_667_5184" x="0.00830078" y="0" width="56" height="56" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="2"/>
          <feGaussianBlur stdDeviation="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.621875 0 0 0 0 0.634687 0 0 0 0 0.75 0 0 0 0.32 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_667_5184"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="9"/>
          <feGaussianBlur stdDeviation="8"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.621875 0 0 0 0 0.634687 0 0 0 0 0.75 0 0 0 0.18 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow_667_5184" result="effect2_dropShadow_667_5184"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_667_5184" result="shape"/>
        </filter>
      </defs>
    </SvgIcon>
  );
};

export { DoneIcon };

import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import { FC, ReactNode } from 'react';
import {
  BarLoader,
  BeatLoader,
  BounceLoader,
  CircleLoader,
  ClimbingBoxLoader,
  ClipLoader,
  ClockLoader,
  DotLoader,
  FadeLoader,
  GridLoader,
  HashLoader,
  MoonLoader,
  PacmanLoader,
  PropagateLoader,
  PuffLoader,
  PulseLoader,
  RingLoader,
  RiseLoader,
  RotateLoader,
  ScaleLoader,
  SyncLoader
} from 'react-spinners';

interface ReactSpinnerProps {
  type?:
  'BarLoader' |
  'BeatLoader' |
  'BounceLoader' |
  'CircleLoader' |
  'ClimbingBoxLoader' |
  'ClipLoader' |
  'ClockLoader' |
  'DotLoader' |
  'FadeLoader' |
  'GridLoader' |
  'HashLoader' |
  'MoonLoader' |
  'PacmanLoader' |
  'PropagateLoader' |
  'PuffLoader' |
  'PulseLoader' |
  'RingLoader' |
  'RiseLoader' |
  'RotateLoader' |
  'ScaleLoader' |
  'SyncLoader',
  color?: string;
  bgColor?: string;
  size?: number;
  sx?: SxProps;
}

const renderReactSpinner = (props: ReactSpinnerProps): ReactNode => {
  const { type, color, size } = props; 

  switch (type) {
    case 'BeatLoader':
      return <BeatLoader color={color} size={size} />;

    case 'BounceLoader':
      return <BounceLoader color={color} size={size} />;

    case 'CircleLoader':
      return <CircleLoader color={color} size={size} />;

    case 'ClimbingBoxLoader':
      return <ClimbingBoxLoader color={color} size={size} />;

    case 'ClipLoader':
      return <ClipLoader color={color} size={size} />;

    case 'ClockLoader':
      return <ClockLoader color={color} size={size} />;

    case 'DotLoader':
      return <DotLoader color={color} size={size} />;

    case 'FadeLoader':
      return <FadeLoader color={color} />;

    case 'GridLoader':
      return <GridLoader color={color} size={size} />;
      
    case 'BarLoader':
      return <BarLoader color={color} />;

    case 'MoonLoader':
      return <MoonLoader color={color} size={size} />;

    case 'PacmanLoader':
      return <PacmanLoader color={color} size={size} />;

    case 'PropagateLoader':
      return <PropagateLoader color={color} size={size} />;

    case 'PuffLoader':
      return <PuffLoader color={color} size={size} />;
      
    case 'PulseLoader':
      return <PulseLoader color={color} size={size} />;

    case 'RingLoader':
      return <RingLoader color={color} size={size} />;

    case 'RiseLoader':
      return <RiseLoader color={color} size={size} />;

    case 'RotateLoader':
      return <RotateLoader color={color} size={size} />;
    case 'ScaleLoader':
      return <ScaleLoader color={color} />;
      
    case 'SyncLoader':
      return <SyncLoader color={color} size={size} />;
    
    default:
      return <HashLoader color={color} size={size} />;
  }
};

const ReactSpinner: FC<ReactSpinnerProps> = (props) => {
  const { type='HashLoader', color='#5569FF', bgColor, size=50, sx } = props;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 5,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: bgColor,
        ...sx,
      }}
      children={renderReactSpinner({
        type: type,
        color: color,
        size: size,
      })}
    />
  );
};

export { ReactSpinner };

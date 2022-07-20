/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { FC, ReactNode } from 'react';
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { SxProps } from '@mui/system';
import { numberSeparation, stringSeparation } from '@els/client/shared/utils';

interface LineProgressProps {
  width?: string;
  height?: string;
  allStep?: number;
  currentStep?: number;
  currentStepColor?: string;
  label?: ReactNode;
  percentColor?: string;
  fullColor?: string;
  color?: string;
  sx?: SxProps;
  processPosition?: 'left' | 'right' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'inside';
}

const LineProgress: FC<LineProgressProps> = (props) => {
  const { percentColor, fullColor, color, width, height = '30px', allStep = 10, currentStep = 1, currentStepColor, sx, processPosition = 'inside', label, ...rest } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: width ? width : '400px',
        height: height ? height : '30px',
        display: 'flex',
        flexDirection: 
          processPosition === 'right'
            ? 'row-reverse'
            : processPosition === 'top' || processPosition === 'top-start' || processPosition === 'top-end'
              ? 'column'
              : processPosition === 'bottom' || processPosition === 'bottom-start' || processPosition === 'bottom-end'
                ? 'column-reverse'
                : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...sx,
      }}
    >
      {
        (processPosition !== 'inside' && !!processPosition) &&
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            width: processPosition === 'top-start' || processPosition === 'top-end'  || processPosition === 'bottom-start' || processPosition === 'bottom-end' ? '100%' : 'unset',
            display: 'flex',
            alignItems: 'start',
            lineHeight: 1,
            color: color ? color : '#000000',
            mx: theme.spacing(1),
            textAlign:
              processPosition === 'top-start' || processPosition === 'bottom-start'
                ? 'left'
                : processPosition === 'top-end' || processPosition === 'bottom-end'
                  ? 'right'
                  : 'center',
          }}
        >
          {label}{<Box sx={{ color: currentStepColor ? currentStepColor : 'unset' }}>{currentStep < allStep ? currentStep : allStep}</Box>}<Box>/</Box><Box>{allStep}</Box>
        </Typography>
      }
      <Box
        sx={{
          backgroundColor: fullColor,
          width: '100%',
          height: '100%',
          minHeight: '10px',
          border: fullColor ? 'unset' : `solid 2px ${percentColor}`,
          borderRadius: `${Math.floor(numberSeparation(height) / 2)}${stringSeparation(height)}`,
          position: 'relative',
        }}
        {...rest}
      >
        {currentStep > 0 && <Box
          sx={{
            backgroundColor: percentColor,
            width: `calc(${Math.floor((numberSeparation('100%') / allStep) * (currentStep < allStep ? currentStep : allStep))}${stringSeparation('100%')} + 2px)`,
            height: '100%',
            borderRadius: `${Math.floor(numberSeparation(height) / 2)}${stringSeparation(height)}`,
            transition: 'all 0.5s',
            position: 'absolute',
            left: '-1px',
          }}
        />}
        {
          (processPosition === 'inside' || !processPosition) &&
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: color ? color : '#000000',
            }}
          >
            {label}{(currentStep < allStep ? currentStep : allStep)}/{allStep}
          </Typography>
        }
      </Box>
    </Box>
  );
};

export { LineProgress };

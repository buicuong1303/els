import { FC } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
import { SxProps } from '@mui/system';
import { styled } from '@mui/material/styles';

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
      flex-grow: 1;
      // height: 10px;
      
      &.MuiLinearProgress-root {
        background-color: '#c2c2c2';
      }
      
      .MuiLinearProgress-bar {
        border-radius: 6px;
      }
`
);

interface LinePercentProps {
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  backgroundPercent?: string;
  variant?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  width?: string;
  height?: string;
  percent?: number;
  label?: string;
  isShowText?: boolean;
  sx?: SxProps;
}

const LinePercent: FC<LinePercentProps> = (props) => {
  const { color, backgroundPercent, variant, width, height = '10px', percent, label, isShowText = true, sx, ...rest } = props;

  return (
    <Box py={2} sx={{ ...sx, height: height, width: width ?? '100%' }}>
      {isShowText && (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {label}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="span"
            >
              ({percent})
            </Typography>
          </Typography>
          <Typography variant="h5">{percent}%</Typography>
        </Box>
      )}
      <LinearProgressWrapper
        value={percent}
        color={color}
        variant={variant}
        sx={{
          ...backgroundPercent && { backgroundColor: backgroundPercent },
          height: height,
        }}
      />
    </Box>
  );
};

export { LinePercent };

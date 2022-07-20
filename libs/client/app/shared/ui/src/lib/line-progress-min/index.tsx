import { FC } from 'react';
import {
  Box,
  LinearProgress,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Text } from '../text';
import { SxProps } from '@mui/system';

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
    flex-grow: 1;
    height: 10px;
    
    &.MuiLinearProgress-root {
      background-color: ${theme.colors.alpha.black[10]};
    }
    
    .MuiLinearProgress-bar {
      border-radius: ${theme.general.borderRadiusXl};
    }
  `
);

interface LineProgressMinProps {
  width?: string;
  height?: string;
  color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined;
  variant?: "determinate" | "indeterminate" | "buffer" | "query" | undefined;
  title?: string;
  align?: "right" | "left" | "inherit" | "center" | "justify" | undefined;
  currentStep: number;
  allStep: number;
  sx: SxProps;
}

const LineProgressMin: FC<LineProgressMinProps> = (props) => {
  const { width, height, color, variant, title, align, currentStep, allStep, sx, ...rest } = props;

  return (
    <Box
      style={{
        width: width
      }}
      sx={sx}
    >
      <Typography variant="subtitle2" gutterBottom align={align}>
        {title}{' '}
        <Text color="black">
          <b>{currentStep}</b>
        </Text>
        <b> /{allStep}</b>
      </Typography>
      <LinearProgressWrapper
        value={Math.floor((100 / allStep) * currentStep)}
        color={color}
        variant={variant}
        sx={{
          height: height
        }}
      />
    </Box>
  );
};

export { LineProgressMin };

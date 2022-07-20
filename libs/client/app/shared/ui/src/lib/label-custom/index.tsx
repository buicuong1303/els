import { FC, ReactNode } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

interface LabelCustomProps {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info' | 'default';
  startIcon?: JSX.Element | string;
  children?: ReactNode;
  endIcon?: JSX.Element | string;
  variant?: 'square' | 'circular' | 'rounded';
  sx?: SxProps;
  onClick?: (e?: any) => void;
}

const LabelWrapper = styled('span')(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      padding: ${theme.spacing(0.5, 1)};
      font-size: ${theme.typography.pxToRem(13)};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      max-height: ${theme.spacing(3)};
      
      &.MuiLabel {
        &-primary {
          background-color: ${theme.colors.primary.lighter};
          color: ${theme.palette.primary.main};
        }
        
        &-secondary {
          background-color: ${theme.colors.secondary.lighter};
          color: ${theme.palette.secondary.main};
        }
        
        &-success {
          background-color: ${theme.colors.success.lighter};
          color: ${theme.palette.success.main};
        }
        
        &-warning {
          background-color: ${theme.colors.warning.lighter};
          color: ${theme.palette.warning.main};
        }
              
        &-error {
          background-color: ${theme.colors.error.lighter};
          color: ${theme.palette.error.main};
        }
        
        &-info {
          background-color: ${theme.colors.info.lighter};
          color: ${theme.palette.info.main};
        }
        
        &-default {
          background-color: unset;
        }
      }
`
);

const LabelCustom: FC<LabelCustomProps> = (props) => {
  const { color = 'secondary', startIcon, children, endIcon, variant, sx, onClick, ...rest } = props;
  const theme = useTheme();
  
  return (
    <LabelWrapper
      className={'MuiLabel-' + color}
      sx={{
        borderRadius: variant === 'circular'
          ? theme.general.borderRadius
          : variant === 'rounded'
            ? '4px'
            : '0px',
        ...sx
      }}
      {...rest}
      onClick={onClick}
    >
      {startIcon}
      {children}
      {endIcon}
    </LabelWrapper>
  );
};

export { LabelCustom };

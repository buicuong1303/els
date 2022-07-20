import { FC, ReactNode } from 'react';
import { Button, Typography, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';
import { styled } from '@mui/material/styles';

export interface TermButtonProps {
  size?: 'small' | 'medium' | 'large' | undefined;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  color?:
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | undefined;
  endIcon?: JSX.Element | string;
  startIcon?: JSX.Element | string;
  onClick?: (event?: any) => void;
  sx?: SxProps;
  children?: ReactNode;
  canSelect?: boolean;
  rest?: any;
}

const ButtonWrapper = styled(Button)(
  ({ theme }) => `
    background-color: ${theme.colors.secondary.lighter};
    margin: 0;
    min-width: 56px;
    padding: 13px 16px;
    // box-shadow: rgb(34 51 84 / 30%) 0px 0.18rem 0.3rem, rgb(34 51 84 / 20%) 0px 0.326rem 3rem !important;
    // box-shadow: rgb(34 51 84 / 30%) 0px 0.18rem 0.3rem, rgb(34 51 84 / 20%) 0px 0rem 0rem !important;
    box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%) !important;
  `
);

const TermButton: FC<TermButtonProps> = (props) => {
  const {
    size = 'large',
    variant = 'contained',
    color = 'inherit',
    endIcon,
    startIcon,
    onClick,
    sx,
    children,
    canSelect = true,
    rest,
  } = props;

  const theme = useTheme();

  return (
    <ButtonWrapper
      size={size}
      variant={variant}
      onClick={canSelect ? onClick : undefined}
      startIcon={startIcon}
      endIcon={endIcon}
      color={color}
      sx={{ 
        // boxShadow: canSelect ? '0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%) !important' : 'inset 0px 1px 1px rgba(0, 0, 0, 0.25) !important',
        boxShadow: canSelect ? 'unset !important' : 'inset 0px 1px 1px rgba(0, 0, 0, 0.25) !important',
        cursor: canSelect ? 'pointer' : 'unset',
        color: canSelect ? 'unset' : theme.colors.alpha.black[30],
        bgcolor: `${theme.palette.grey[300]} !important`,
        ':hover': {
          bgcolor: canSelect ? `${theme.colors.primary.main} !important` : 'unset',
          color: canSelect ? '#ffffff !important' : theme.colors.alpha.black[30],
        },
        '&:active': {
          bgcolor: canSelect ? `${theme.colors.primary.main} !important` : 'unset',
          color: canSelect ? '#ffffff !important' : theme.colors.alpha.black[30],
        },
        ...sx
      }}
      {...rest}
      children={
        <Typography
          variant="h4"
          color="unset"
          children={children}
          sx={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}
        />
      }
    />
  );
};

export { TermButton };

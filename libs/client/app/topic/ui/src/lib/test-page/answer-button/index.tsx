import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { FC, ReactNode } from 'react';

export interface AnswerButtonProps {
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
  isClicked?: boolean;
  rest?: any;
}

const ButtonWrapper = styled(Button)(
  ({ theme }) => `
    display: flex;
    justify-content: space-between;
    padding: ${theme.spacing(2, 4)};
    border-radius: 6px;
    // box-shadow: rgb(34 51 84 / 30%) 0px 0.18rem 0.3rem, rgb(34 51 84 / 20%) 0px 0.326rem 3rem !important;
    // box-shadow: rgb(34 51 84 / 30%) 0px 0.18rem 0.3rem, rgb(34 51 84 / 20%) 0px 0rem 0rem !important;
    // box-shadow: 0px 9px 16px rgb(159 162 191 / 18%), 0px 2px 2px rgb(159 162 191 / 32%) !important;
  `
);

const AnswerButton: FC<AnswerButtonProps> = (props) => {
  const {
    size = 'large',
    variant = 'outlined',
    color = 'inherit',
    endIcon,
    startIcon,
    onClick,
    sx,
    children,
    isClicked,
    rest,
  } = props;

  return (
    <ButtonWrapper
      size={size}
      variant={variant}
      onClick={isClicked ? undefined : onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      color={color}
      sx={sx}
      {...rest}
      children={
        <Typography
          color="unset"
          children={children}
          sx={{ minHeight: '22px', display: 'flex', alignItems: 'center' }}
        />
      }
    />
  );
};

export { AnswerButton };

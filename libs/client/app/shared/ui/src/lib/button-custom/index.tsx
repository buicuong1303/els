import { FC, useRef, useState, ReactNode, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { SxProps } from '@mui/system';

export interface ButtonCustomProps {
  buttonRef?: any;
  size?: 'small' | 'medium' | 'large' | undefined;
  variant?:  'text' | 'outlined' | 'contained' | undefined;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined;
  endIcon?: JSX.Element | string | ReactNode;
  startIcon?: JSX.Element | string | ReactNode;
  onClick?: (event?: any) => any;
  sx?: SxProps;
  children?: ReactNode;
  reopenIn?: number; // millisecond
  showCountdown?: boolean;
  rest?: any;
  type?: string
}

const ButtonCustom: FC<ButtonCustomProps> = (props) => {
  const { buttonRef, size, variant, color, endIcon, startIcon, onClick, sx, children, reopenIn, showCountdown, type, rest } = props;

  const [temporarilyDisabled, setTemporarilyDisabled] = useState<boolean>(false);

  const temporarilyDisabledTimeoutRef = useRef<any>();

  const handleTemporarilyDisabled = () => {
    if (temporarilyDisabledTimeoutRef.current) clearTimeout(temporarilyDisabledTimeoutRef.current);
    temporarilyDisabledTimeoutRef.current = setTimeout(() => {
      setTemporarilyDisabled(false);
    }, reopenIn);
  };

  const [countdownTimer, setCountdownTimer] = useState<number>(0);
  const countdownTimeoutRef = useRef<any>();
  const handleCountdown = (currentCountdownTimer: number) => {
    if (currentCountdownTimer <= 0) return;

    clearTimeout(countdownTimeoutRef.current);
    countdownTimeoutRef.current = setTimeout(() => {
      const newCurrentCountdownTimer = currentCountdownTimer - 1;
      setCountdownTimer(newCurrentCountdownTimer);
      handleCountdown(newCurrentCountdownTimer);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(temporarilyDisabledTimeoutRef.current);
      clearTimeout(countdownTimeoutRef.current);
    };
  }, []);
  return (
    <Button
      type={type}
      ref={buttonRef}
      disabled={temporarilyDisabled}
      size={size}
      variant={variant}
      onClick={(e) => {
        if (type === 'submit') return;
        if (onClick) onClick(e);
        setTemporarilyDisabled(true);
        handleTemporarilyDisabled();
        handleCountdown(reopenIn ? reopenIn / 1000 : 0);
      }}
      startIcon={startIcon}
      endIcon={endIcon}
      color={color}
      sx={{
        ...sx,
        '.MuiButton-startIcon': children ? {} : { m: 0 },
        '.MuiButton-endIcon': children ? {} : { m: 0 },
      }}
      {...rest}

    >
      {children}
      { showCountdown && !!countdownTimer && <Box sx={{ ml: 0.5 }}>({countdownTimer})</Box>}
    </Button>
  );
};

export { ButtonCustom };

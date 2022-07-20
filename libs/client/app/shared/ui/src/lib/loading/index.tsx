import { FC } from 'react';
import { Box, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';

interface LoadingProps {
  bgColor?: string;
  sx?: SxProps;
}

const Loading: FC<LoadingProps> = (props) => {
  const theme = useTheme();

  const { bgColor, sx } = props;
  
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
      children={<img alt="" src="/images/icon/loading.gif" />}
    />
    
  );
};

export { Loading };

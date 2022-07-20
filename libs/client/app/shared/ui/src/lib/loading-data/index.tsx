import { FC } from 'react';
import { Box, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';

interface LoadingDataProps {
  gifUrl?: string;
  bgColor?: string;
  sx?: SxProps;
}

const LoadingData: FC<LoadingDataProps> = (props) => {
  const theme = useTheme();

  const { gifUrl = '/images/icon/spin.gif', bgColor, sx } = props;
  
  return (

    <Box
      sx={{
        zIndex: 5,
        width: '24px',
        height: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: bgColor,
        ...sx,
      }}
      children={<img style={{ maxWidth: '100%' }} alt="" src={gifUrl} />}
    />
    
  );
};

export { LoadingData };

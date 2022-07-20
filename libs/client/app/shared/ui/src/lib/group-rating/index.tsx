import { FC } from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import { SxProps } from '@mui/system';
import { Text } from '../text';

interface GroupRatingProps {
  rating: string;
  sx: SxProps;
}

const GroupRating: FC<GroupRatingProps> = (props) => {
  const { rating, sx, ...rest } = props;

  return (
    <Box
      sx={{
        lineHeight: 0.8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        minWidth: 100,
        ...sx
      }}
      {...rest}
    >
      <Text color="warning">
        <StarTwoToneIcon />
      </Text>
      <Typography variant="h5">{rating}</Typography>
    </Box>
  );
};

export { GroupRating };

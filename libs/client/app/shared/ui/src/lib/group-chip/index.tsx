/* eslint-disable-next-line */
import { SxProps } from '@mui/system';
import { FC } from 'react';
import { Chip } from '@mui/material';

export interface GroupChipProps {
  label: string;
  sx: SxProps;
  onClick: () => void;
  onDelete: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium';
}

const GroupChip: FC<GroupChipProps> = (props) => {
  const {sx, size, label, color, onClick, onDelete } = props;

  return <Chip
    sx={sx}
    size={size}
    label={label}
    color={color}
    onClick={onClick}
    onDelete={onDelete}
  />;
}

export { GroupChip };

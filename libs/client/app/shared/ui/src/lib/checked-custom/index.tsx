/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode } from 'react';
import {
  FormControlLabel,
  Checkbox,
  useTheme
} from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { SxProps } from '@mui/system';

export interface CheckedCustomProps {
  color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  variant?: 'outlined' | 'contained';
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  onChange?: (e?: any) => void;
  onClick?: (e?: any) => void;
  sx?: SxProps;
  rest?: any;
  icon?: ReactNode;
  checkedIcon?: ReactNode;
}

const CheckedCustom: FC<CheckedCustomProps> = (props) => {
  const { color, variant = 'outlined', label, name, checked, onChange, onClick, disabled, sx, icon, checkedIcon, rest } = props;

  const theme = useTheme();

  return (
    <FormControlLabel
      control={
        <Checkbox
          color={color}
          name={name}
          checked={checked}
          onChange={onChange}
          onClick={onClick}
          sx={{ padding: theme.spacing(0, .5, 0, 0)}}
          icon={
            icon
              ? icon
              : variant === 'outlined'
                ? <CheckBoxOutlineBlankOutlinedIcon />
                : <CheckBoxOutlineBlankIcon />
          }
          checkedIcon={
            checkedIcon
              ? checkedIcon
              : variant === 'outlined'
                ? <CheckBoxOutlinedIcon />
                : <CheckBoxIcon />}
        />
      }
      label={label}
      sx={{
        marginLeft: 0,
        userSelect: 'none',
        '& .MuiFormControlLabel-label': {
          fontWeight: 500,
          fontSize: '15px',
        },
        '&:hover': {
          color: theme.colors.primary.light,
        },
        ...sx
      }}
      disabled={disabled}
      {...rest}
    />
  );
};

export { CheckedCustom };

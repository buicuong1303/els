/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, ReactNode, useState } from 'react';
import { TextField, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';
import NumberFormat from 'react-number-format';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  ref: any;
  name: string;
}

export const NumberFormatCustom = React.forwardRef<NumberFormat<any>, CustomProps>(
  (props: CustomProps, refs?: any) => {
    const { onChange, ref, ...other } = props;

    return (
      <NumberFormat
        getInputRef={ref}
        onValueChange={(values: any) => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          });
        }}
        {...other}
      />
    );
  }
);

interface InputCustomProps {
  field?: any;
  form?: any;
  ref?: any;
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  endAdornment?: ReactNode;
  type?: 'text' | 'number' | 'password';
  onChange: (e: any) => void;
  onKeyUp?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  borderRadius?: string;
  variant?: 'standard' | 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  error?: boolean;
  helperText?: string;
  rest?: any;
  sx?: SxProps;
  isNumberFormat?: boolean;
  numberFormatType?: 'text' | 'tel' | 'password';
  format?: string;
  suffix?: string;
  prefix?: string;
  thousandsGroupStyle?: 'thousand' | 'lakh' | 'wan';
}

const InputCustom: FC<InputCustomProps> = (props) => {
  const {
    ref,
    name,
    value,
    label,
    placeholder,
    endAdornment,
    type,
    onChange,
    onKeyUp,
    onKeyDown,
    required,
    disabled,
    readOnly,
    fullWidth = true,
    borderRadius,
    variant = 'outlined',
    color = 'primary',
    error,
    helperText,
    rest,
    sx,
    isNumberFormat,
    numberFormatType,
    format = '(###) ###-####',
    suffix,
    prefix,
    thousandsGroupStyle
  } = props;

  const { t }: { t: any } = useTranslation();

  const theme = useTheme();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <TextField
      {...!isNumberFormat && { ref }}
      name={t(name)}
      label={t(label)}
      placeholder={t(placeholder)}
      value={value}
      type={
        type === 'password'
          ? showPassword
            ? 'string'
            : type
          : type
      }
      onChange={onChange}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      error={error}
      helperText={helperText}
      InputProps={{
        endAdornment: 
          type === 'password'
            ? showPassword
              ? <VisibilityOffIcon onClick={() => setShowPassword(false)} sx={{ cursor: 'pointer' }} />
              : <VisibilityIcon onClick={() => setShowPassword(true)} sx={{ cursor: 'pointer' }} />
            : endAdornment,
        readOnly: readOnly,
        ...(isNumberFormat && {
          inputComponent: NumberFormatCustom,
          inputProps: {
            ref: ref,
            name: name,
            value: value,
            onChange: onChange,
            type: numberFormatType,
            format: format,
            suffix: suffix,
            prefix: prefix,
            thousandsGroupStyle: thousandsGroupStyle
          }
        })
      }}
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: borderRadius,
          maxHeight: '40px',
          ...readOnly && { opacity: .3 },
        },
        Label: {
          fontWeight: 700
        },
        fieldset: {
          border: 'unset'
        },
        ...sx,
      }}
      {...rest}
    />
  );
};

export { InputCustom };

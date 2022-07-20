/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseTextFieldProps, TextField } from '@mui/material';
import { SxProps } from '@mui/system';
import { useField } from 'formik';
import { FC, useEffect, useState } from 'react';

interface CustomFormikTextFieldProps extends BaseTextFieldProps {
  sx?: SxProps;
  field?: any;
  form?: any;
  inputComponent?: any;
};

const CustomFormikTextField: FC<CustomFormikTextFieldProps> = (props) => {
  const { form, field, inputComponent, ...rest } = props; 
  const [FieldInputProps, FieldMetaProps, FieldHelperProps] = useField(field.name);

  const [value, setValue] = useState('');

  const onChange = (value: any) => {
    setValue(value);

    form.setFieldValue(field.name, value);
  };
  useEffect(() => {
    setValue(field.value === null ? '' : field.value);
  }, [field]);

  return inputComponent ? (
    <TextField
      InputProps={{
        inputComponent: inputComponent,
      }}
      autoComplete="off"
      error={form.isSubmitting && !!FieldMetaProps.error}
      helperText={form.isSubmitting ? FieldMetaProps.error : ''}
      onChange={(event) => onChange(event.target.value)}
      value={value}
      variant="outlined"
      {...rest}
      size="medium"

    />
  ) : (<TextField
    autoComplete="off"
    error={form.isSubmitting && !!FieldMetaProps.error}
    helperText={form.isSubmitting ? FieldMetaProps.error : ''}
    onChange={(event) => onChange(event.target.value)}
    value={value}
    multiline
    variant="outlined"
    {...rest}
    size="medium"

  />);
};

export { CustomFormikTextField };

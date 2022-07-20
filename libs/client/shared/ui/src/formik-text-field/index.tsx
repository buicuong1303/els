/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseTextFieldProps, TextField } from '@mui/material';
import { SxProps } from '@mui/system';
import { useField } from 'formik';
import { FC, useEffect, useState } from 'react';

interface FormikTextFieldProps extends BaseTextFieldProps {
  sx?: SxProps;
  field?: any;
  form?: any;
  inputComponent?: any;
};

const FormikTextField: FC<FormikTextFieldProps> = (props) => {
  const { form, field, inputComponent, ...rest } = props; 
  const { name, value } = field;
  const { errors, touched, isSubmitting } = form;

  let showError = false;
  if (errors[name] && touched[name]) showError = true;
  else if (errors[name] && isSubmitting) showError = true;

  const handleChange = (e: any) => {
    const changeEvent = {
      target: {
        name: name,
        value: e.target.value
      }
    };
    field.onChange(changeEvent);
  };

  return inputComponent ? (
    <TextField
      InputProps={{
        inputComponent: inputComponent,
      }}
      autoComplete="off"
      error={showError}
      helperText={showError && errors[name]}
      onChange={handleChange}
      value={value}
      variant="outlined"
      {...rest}
      size="medium"

    />
  ) : (<TextField
    autoComplete="off"
    error={showError}
    helperText={showError && errors[name]}
    onChange={handleChange}
    value={value}
    multiline
    variant="outlined"
    {...rest}
    size="medium"

  />);
};

export { FormikTextField };

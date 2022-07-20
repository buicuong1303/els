/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TextField,
  styled,
} from '@mui/material';
import { useState } from 'react';
import { NodeInputProps } from './helpers';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { errorFields } from '.';
import { NumberFormatCustom } from '@els/client/shared/ui';

const TextFieldWrapper = styled(TextField)(
  ({ theme }) => `
    margin-bottom:${theme.spacing(3)} !important;
  `
);

export function NodeInputFormatNumber<T>(props: NodeInputProps) {
  const { t }: { t: any } = useTranslation();
  const {
    node,
    attributes,
    value = '',
    setValue,
    disabled,
    errors,
    dispatchSubmit,
    sx,
    size,
    type,
    isNumberFormat,
    numberFormatType,
    format = '(###) ###-####',
    suffix,
    prefix,
    thousandsGroupStyle,
  } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick);
      run();
    }
  };
  const getLabel = (nodeInput: any) => {
    switch (nodeInput.meta.label?.text) {
      case 'ID':
        return '* ' + t('Username / E-mail');

      case undefined: {
        if (nodeInput.group === 'link') return '* Email';
        return t('Username');
      }

      default:
        return nodeInput.attributes.required
          ? '* ' + t(nodeInput.meta.label?.text)
          : t(nodeInput.meta.label?.text);
    }
  };
  const hasError = (nodeInput: any) => {
    if (errors && errors[nodeInput.attributes.name] && nodeInput.messages[0]?.type === 'error') {
      return true;
    }
    return false;
  };
  const getError = (nodeInput: any) => {
    if (errors && errors[nodeInput.attributes.name]) {
      return errors[nodeInput.attributes.name];
    }
    return nodeInput.messages[0]?.text;
  };
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      dispatchSubmit(e);
    }
  };
  
  const showVisibilityIcon = () => {
    showPassword 
      ? <VisibilityOffIcon onClick={() => setShowPassword(false)} sx={{ cursor: 'pointer' }} />
      : <VisibilityIcon onClick={() => setShowPassword(true)} sx={{ cursor: 'pointer' }} />;
  };
 
  // Render a generic text input field.
  return (
    <TextFieldWrapper
      fullWidth
      autoFocus
      size={size}
      label={t(getLabel(node))}
      onClick={onClick}
      // onChange={(e) => {
      //   setValue(e.target.value);
      // }}
      onKeyUp={(e: any) => {
        setValue(e.target.value);
      }}
      type={ showPassword
        ? 'text'
        : type
      }
      name={attributes.name}
      value={value}
      error={hasError(node)}
      helperText={t(errorFields[getError(node)]) ? t(errorFields[getError(node)]) : t(getError(node)) }
      disabled={attributes.disabled || disabled}
      onKeyDownCapture={handleKeyDown}
      InputLabelProps={{
        shrink: !!value,
      }}
      InputProps={{
        endAdornment: 
          type === 'password'
            ? showVisibilityIcon
            : null,
        ...(isNumberFormat && {
          inputComponent: NumberFormatCustom,
          inputProps: {
            ref: undefined,
            name: attributes.name,
            value: value,
            // onChange: (e: any) => {
            //   setValue(e.target.value);
            // },
            onkeyup: (e: any) => {
              setValue(e.target.value);
            },
            type: numberFormatType,
            format: format,
            suffix: suffix,
            prefix: prefix,
            thousandsGroupStyle: thousandsGroupStyle
          }
        } as any)
      }}
      // help={node.messages.length > 0}
      // state={
      //   node.messages.find(({ type }) => type === 'error') ? 'error' : undefined
      // }
      // subtitle={
      //   <>
      //     {node.messages.map(({ text, id }, k) => (
      //       <span key={`${id}-${k}`} data-testid={`ui/message/${id}`}>
      //         {text}
      //       </span>
      //     ))}
      //   </>
      // }
      sx={sx}
    />
  );
}

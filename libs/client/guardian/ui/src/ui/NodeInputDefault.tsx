/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  styled, TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NodeInputProps } from './helpers';


const TextFieldWrapper = styled(TextField)(
  ({ theme }) => `
    margin-bottom:${theme.spacing(3)} !important;
  `
);

export const errorFields: any = {
  'Property password_identifier is missing.': 'Is required.',
  'Property password is missing.': 'Is required.',
  'The firstName field is required.': 'Is required.',
  'The lastName field is required.': 'Is required.',
  'The username field is required.': 'Is required.',
  'The email field is required.': 'Is required.',
  'The password field is required.': 'Is required.',
  'The confirmPassword field is required.': 'Is required.',
  '["traits.firstName"] must be at most 255 characters': 'Maximum of 255 characters.',
  '["traits.lastName"] must be at most 255 characters': 'Maximum of 255 characters.',
  '["traits.username"] must be at most 255 characters': 'Maximum of 255 characters.',
  '["traits.email"] must be at most 255 characters': 'Maximum of 255 characters.',
  'The email provided should be a valid email address.': 'Need to provide a valid email address.',
  'The confirmPassword must match.': 'Need to match the password field.',
};

export function NodeInputDefault(props: NodeInputProps) {
  const { t }: { t: any } = useTranslation();
  const { node, attributes, value = '', setValue, disabled, errors,  dispatchSubmit } = props;
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
  const getLabel = (node: any) => {
    switch (node.meta.label?.text) {
      case 'ID':
        return '* ' + t('Username / E-mail');

      case undefined: {
        if (node.group === 'link') return '* ' + 'Email';
        return t('Username');
      }

      default:
        return node.attributes.required
          ? '* ' + t(node.meta.label?.text)
          : t(node.meta.label?.text);
    }
  };
  const hasError = (node: any) => {
    if (errors && errors[node.attributes.name]) {
      return true;
    }
    return node.messages[0]?.type === 'error' ? true : false;
  };
  const getError = (node: any) => {
    if (errors && errors[node.attributes.name]) {
      return errors[node.attributes.name];
    }
    return node.messages[0]?.text;
  };
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      const button = document.getElementById('button-limit-submit');
      if (button)
        button.click();
      else
        dispatchSubmit(e);
    }
  };

  return (
    <TextFieldWrapper
      fullWidth
      autoFocus
      label={t(getLabel(node))}
      onClick={onClick}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      type={attributes.type}
      name={attributes.name}
      value={value}
      error={hasError(node)}
      helperText={t(errorFields[getError(node)]) ? t(errorFields[getError(node)]) : t(getError(node)) }
      disabled={attributes.disabled || disabled}
      onKeyDownCapture={handleKeyDown}
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
    />
  );
}

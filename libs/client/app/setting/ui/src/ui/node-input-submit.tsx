/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonCustom } from '@els/client/app/shared/ui';
import { getNodeLabel } from '@ory/integrations/ui';
import { useTranslation } from 'react-i18next';
import { NodeInputProps } from './helpers';

export function NodeInputSubmit<T>({
  nodeRef,
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit,
  startIcon,
  sx,
  variant,
}: NodeInputProps) {
  const { t }: { t: any } = useTranslation();
  return (
    <ButtonCustom
      buttonRef={nodeRef}
      color="primary"
      size="medium"
      variant={variant ? variant : 'outlined'}
      rest={{ fullWidth: true }}
      reopenIn={10}
      onClick={(e: any) => {
        // On click, we set this value, and once set, dispatch the submission!
        setValue(attributes.value).then(() => dispatchSubmit(e));
      }}
      startIcon={startIcon}
      sx={{
        minHeight: '38px',
        ...sx,
      }}
    >
      {t(getNodeLabel(node))}
    </ButtonCustom>
  );
}

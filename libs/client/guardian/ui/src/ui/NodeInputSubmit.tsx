import { ButtonCustom } from '@els/client/app/shared/ui';
import { getNodeLabel } from '@ory/integrations/ui';
import { useTranslation } from 'react-i18next';
import { NodeInputProps } from './helpers';

export function NodeInputSubmit<T>({
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit,
}: NodeInputProps) {
  const { t }: { t: any } = useTranslation();
  return (
    <>
      <ButtonCustom
        color="primary"
        size="large"
        variant="contained"
        rest={{ fullWidth: true }}
        reopenIn={10}
        onClick={(e: any) => {
          // On click, we set this value, and once set, dispatch the submission!
          setValue(attributes.value).then(() => dispatchSubmit(e));
        }}
      >
        {t(getNodeLabel(node))}

      </ButtonCustom>

      {/* <Button
        style={{width: '100%'}}
        name={attributes.name}
        size="large"
        onClick={(e: any) => {
          // On click, we set this value, and once set, dispatch the submission!
          setValue(attributes.value).then(() => dispatchSubmit(e));
        }}
        value={attributes.value || ''}

      >
        {getNodeLabel(node)}
      </Button> */}
    </>
  );
}

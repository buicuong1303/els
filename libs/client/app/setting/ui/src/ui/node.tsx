/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  isUiNodeInputAttributes,
} from '@ory/integrations/ui';
import { UiNode } from '@ory/client';
import { NodeInput } from './node-input';
import { FormDispatcher, ValueSetter } from './helpers';
import { SxProps } from '@mui/system';
import { ReactNode } from 'react';

interface Props {
  nodeRef?: any;
  node: UiNode
  disabled: boolean
  value: any
  setValue: ValueSetter
  dispatchSubmit: FormDispatcher,
  startIcon?: ReactNode;
  sx?: SxProps;
  size?: 'medium' | 'small',
  errors?: any;
  variant?: 'contained' | 'outlined';
  type?: 'text' | 'password'
}

export const Node = ({
  nodeRef,
  node,
  value,
  setValue,
  disabled,
  dispatchSubmit,
  startIcon,
  sx,
  size,
  errors,
  variant,
  type
}: Props) => {
  if (isUiNodeInputAttributes(node.attributes)) {
    return (
      <NodeInput
        nodeRef={nodeRef}
        dispatchSubmit={dispatchSubmit}
        value={value}
        setValue={setValue}
        node={node}
        disabled={disabled}
        attributes={node.attributes}
        startIcon={startIcon}
        size={size}
        errors={errors}
        variant={variant}
        type={type}
        sx={sx}
      />
    );
  }

  return null;
};

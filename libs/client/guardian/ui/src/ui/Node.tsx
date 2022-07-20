import {
  isUiNodeInputAttributes
} from '@ory/integrations/ui';
import { UiNode } from '@ory/client';
import { FormDispatcher, ValueSetter } from './helpers';
import { NodeInput } from './NodeInput';

interface Props {
  node: UiNode
  disabled: boolean
  value: any
  setValue: ValueSetter
  dispatchSubmit: FormDispatcher
  values: any
  errors?: any
}

export const Node = ({
  node,
  value,
  values,
  setValue,
  disabled,
  dispatchSubmit,
  errors
}: Props) => {
  // if (isUiNodeImageAttributes(node.attributes)) {
  //   return <NodeImage node={node} attributes={node.attributes} />
  // }

  // if (isUiNodeScriptAttributes(node.attributes)) {
  //   return <NodeScript node={node} attributes={node.attributes} />
  // }

  // if (isUiNodeTextAttributes(node.attributes)) {
  //   return <NodeText node={node} attributes={node.attributes} />
  // }

  // if (isUiNodeAnchorAttributes(node.attributes)) {
  //   return <NodeAnchor node={node} attributes={node.attributes} />
  // }
  if (isUiNodeInputAttributes(node.attributes)) {
    return (
      <NodeInput
        dispatchSubmit={dispatchSubmit}
        value={value}
        values={values}
        setValue={setValue}
        node={node}
        disabled={disabled}
        errors={errors}
        attributes={node.attributes}
      />
    );
  }

  return null;
};

import { NodeInputButton } from './NodeInputButton';
import { NodeInputCheckbox } from './NodeInputCheckBox';
import { NodeInputDefault } from './NodeInputDefault';
import { NodeInputHidden } from './NodeInputHidden';
import { NodeInputSubmit } from './NodeInputSubmit';
import { NodeInputLimitSubmit } from './NodeInputLimitSubmit';
import { NodeInputProps } from './helpers';

export function NodeInput(props: NodeInputProps) {
  const { attributes } = props;

  switch (attributes.type) {
    case 'hidden':
      // Render a hidden input field
      return <NodeInputHidden {...props} />;
    case 'checkbox':
      // Render a checkbox. We have one hidden element which is the real value (true/false), and one
      // display element which is the toggle value (true)!
      return <NodeInputCheckbox {...props} />;
    case 'button':
      // Render a button
      return <NodeInputButton {...props} />;
    case 'submit': {
      switch (attributes.value) {
        case 'link':
          return <NodeInputLimitSubmit {...props} />;
        default:
          return <NodeInputSubmit {...props} />;
      }
    }
  }
  // Render a generic text input field.
  return <NodeInputDefault {...props} />;
}

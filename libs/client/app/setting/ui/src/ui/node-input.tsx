/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeInputDefault } from './node-input-default';
import { NodeInputHidden } from './node-input-hidden';
import { NodeInputSubmit } from './node-input-submit';
import { NodeInputProps } from './helpers';
import { NodeInputFormatNumber } from '.';

export function NodeInput<T>(props: NodeInputProps) {
  const { attributes } = props;

  if (attributes.name === 'traits.phone') {
    return <NodeInputFormatNumber isNumberFormat numberFormatType="tel" format="(###) ###-####" {...props} />;
  }

  switch (attributes.type) {
    case 'hidden':
      // Render a hidden input field
      return <NodeInputHidden {...props} />;
    // case 'checkbox':
    //   // Render a checkbox. We have one hidden element which is the real value (true/false), and one
    //   // display element which is the toggle value (true)!
    //   return <NodeInputCheckbox {...props} />
    // case 'button':
    //   // Render a button
    //   return <NodeInputButton {...props} />
    case 'submit':
      // Render the submit button
      return <NodeInputSubmit {...props} />;
  }

  // Render a generic text input field.
  return <NodeInputDefault {...props} />;
}

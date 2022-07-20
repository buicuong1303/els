import { ComponentStory, ComponentMeta } from '@storybook/react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { LabelCustom } from '.';

export default {
  title: 'Shared/LabelCustom',
  component: LabelCustom,

  argTypes: {
    color: {
      name: 'color',
      defaultValue: 'success',
      description: 'color props',
      options: ['primary', 'secondary', 'error', 'warning', 'success', 'info', 'default'],
      control: { type: 'select' }
    },
    variant: {
      name: 'variant',
      type: { name: 'string', required: false },
      defaultValue: 'square',
      description: 'variant props',
      options: ['square', 'circular', 'rounded'],
      control: { type: 'select' }
    },
  },

  args: {
    children: 'This is label',
  },
} as ComponentMeta<typeof LabelCustom>;

const Template: ComponentStory<typeof LabelCustom> = (args) => <LabelCustom {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
};

export const Warning = Template.bind({});
Warning.args = {
  color: 'warning',
};

export const Success = Template.bind({});
Success.args = {
  color: 'success',
  variant: 'rounded',
  endIcon: <ArrowDownwardIcon fontSize="small" style={{ marginLeft: '4px' }} />,
};

export const Error = Template.bind({});
Error.args = {
  color: 'error',
};

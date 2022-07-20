import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LinePercent } from '.';

export default {
  title: 'Shared/LinePercent',
  component: LinePercent,

  argTypes: {
    sx: {
      name: 'sx',
      type: { name: 'object', required: false },
      control: {
        type: 'object'
      }
    },
    color: {
      name: 'color',
      type: { name: 'string', required: false },
      defaultValue: 'primary',
      description: 'color props',
      options: ['inherit', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      control: { type: 'select' }
    },
    variant: {
      name: 'variant',
      type: { name: 'string', required: false },
      defaultValue: 'determinate',
      description: 'variant props',
      options: ['determinate', 'indeterminate', 'buffer', 'query'],
      control: { type: 'select' }
    },
  },

  args: {
    color: 'info',
    variant: 'buffer',
    width: '100%',
    height: '5px',
    percent: 30,
    label: 'website',
    sx: {},
  },
} as ComponentMeta<typeof LinePercent>;

const Template: ComponentStory<typeof LinePercent> = (args) => <LinePercent {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};
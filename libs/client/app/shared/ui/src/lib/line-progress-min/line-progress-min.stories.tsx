import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LineProgressMin } from '.';

export default {
  title: 'Shared/LineProgressMin',
  component: LineProgressMin,

  argTypes: {
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
    align: {
      name: 'align',
      type: { name: 'string', required: false },
      defaultValue: 'left',
      description: 'align props',
      options: ['right', 'left', 'inherit', 'center', 'justify'],
      control: { type: 'select' }
    },
  },

  args: {
    width: '500px',
    height: '10px',
    color: 'info',
    currentStep: 6,
    allStep: 10,
    variant: 'buffer',
    title: '',
    align: 'left'
  },
} as ComponentMeta<typeof LineProgressMin>;

const Template: ComponentStory<typeof LineProgressMin> = (args) => <LineProgressMin {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};
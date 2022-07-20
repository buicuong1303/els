import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LineProgress } from '.';

export default {
  title: 'Shared/LineProgress',
  component: LineProgress,

  argTypes: {
    sx: {
      name: 'sx',
      type: { name: 'object', required: false },
      control: {
        type: 'object'
      }
    }
  },

  args: {
    color: '#000000',
    width: '500px',
    height: '30px',
    allStep: 10,
    percentColor: 'blue',
    currentStep: 3,
  },
} as ComponentMeta<typeof LineProgress>;

const Template: ComponentStory<typeof LineProgress> = (args) => <LineProgress {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};
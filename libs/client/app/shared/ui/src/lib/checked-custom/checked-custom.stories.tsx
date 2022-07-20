import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CheckedCustom } from '.';

export default {
  title: 'Shared/CheckedCustom',
  component: CheckedCustom,

  argTypes: {
    variant: {
      name: 'variant',
      type: { name: 'string', required: false },
      defaultValue: 'contained',
      description: 'variant props',
      options: ['contained', 'outlined'],
      control: { type: 'radio' }
    },
  },

  args: {
    color: 'info',
    variant: 'contained',
    label: 'Đã đăng ký',
    name: 'registered',
    onChange: () => console.log('Clicked'),
    disabled: false
  },
} as ComponentMeta<typeof CheckedCustom>;

const Template: ComponentStory<typeof CheckedCustom> = (args) => <CheckedCustom {...args} />;

export const Default = Template.bind({});
Default.args = {
};

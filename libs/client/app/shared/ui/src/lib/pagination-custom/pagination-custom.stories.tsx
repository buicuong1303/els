import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PaginationCustom } from '.';

export default {
  title: 'Shared/PaginationCustom',
  component: PaginationCustom,

  argTypes: {
  },

  args: {
    count: 10,
    defaultPage: 1,
    onChange: (newPage) => console.log(newPage), 
  },
} as ComponentMeta<typeof PaginationCustom>;

const Template: ComponentStory<typeof PaginationCustom> = (args) => <PaginationCustom {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'outlined',
  shape: 'rounded',
  color: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'text',
  shape: 'circular',
  color: 'secondary',
};
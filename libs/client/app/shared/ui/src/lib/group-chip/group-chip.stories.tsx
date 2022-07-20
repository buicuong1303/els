import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GroupChip } from '.';

export default {
  title: 'Shared/GroupChip',
  component: GroupChip,

  argTypes: {
    sx: {
      name: 'sx',
      type: { name: 'object', required: false },
    },
    size: {
      name: 'size',
      type: { name: 'string', required: false },
      defaultValue: 'small',
      description: 'size props',
      options: ['small', 'medium'],
      control: { type: 'select' }
    },
    color: {
      name: 'status',
      type: { name: 'string', required: false },
      defaultValue: 'primary',
      description: 'status props',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
      control: { type: 'select' }
    },
  },

  args: {
    sx: { mr: '1px' },
    size: 'medium',
    label: 'Development',
    color: 'primary',
    onClick: () => console.log('On click'),
    onDelete: () => console.log('On delete'),
  },
} as ComponentMeta<typeof GroupChip>;

const Template: ComponentStory<typeof GroupChip> = (args) => <GroupChip {...args} />;

export const Default = Template.bind({});
Default.args = {
};

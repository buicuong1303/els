import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GroupRating } from '.';

export default {
  title: 'Shared/GroupRating',
  component: GroupRating,

  argTypes: {
    rating: {
      name: 'rating',
      defaultValue: '5.0',
      description: 'rating props',
    },
    sx: {
      name: 'sx',
      type: { name: 'object', required: false },
      // defaultValue: {},
      // description: 'overwritten description',
      // table: {
      //   type: { 
      //     summary: 'something short', 
      //     detail: 'something really really long' 
      //   },
      //   defaultValue: { summary: 'Hello' },
      // },
      control: {
        // type: 'object'
      }
    }
  },

  args: {
    rating: '5.0',
  },
} as ComponentMeta<typeof GroupRating>;

const Template: ComponentStory<typeof GroupRating> = (args) => <GroupRating {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  sx: {
    lineHeight: 0.8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minWidth: 100,
  }
};
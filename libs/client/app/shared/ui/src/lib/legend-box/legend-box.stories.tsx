import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LegendBox } from '.';

export default {
  title: 'Shared/LegendBox',
  component: LegendBox,

  argTypes: {
  },

  args: {
    width: '300px',
    sx: {},
    callback: () => console.log('Clicked'),
  },
} as ComponentMeta<typeof LegendBox>;

const Template: ComponentStory<typeof LegendBox> = (args) => <LegendBox {...args} />;

export const Version1 = Template.bind({});
Version1.args = {
  backgroundColor: 'blue',
  dotColor: 'green',
  label: 'Da thuoc',
  value: 140,
  buttonText: 'Xem',
};

export const Version2 = Template.bind({});
Version2.args = {
  backgroundColor: 'orange',
  dotColor: 'red',
  label: 'Sap quen',
  value: 10,
  buttonText: 'On tap',
};

export const Version3 = Template.bind({});
Version3.args = {
  backgroundColor: 'red',
  dotColor: 'yellow',
  label: 'Da quen',
  value: 20,
  buttonText: 'On tap',
};
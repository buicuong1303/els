import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PageTitle } from '.';

export default {
  title: 'Shared/PageTitle',
  component: PageTitle,

  argTypes: {
  },

  args: {
    label: 'Button Custom',
    // endIcon: undefined,
    // startIcon: undefined,
    onClick: () => console.log('Clicked'),
    sx: {},
  },
} as ComponentMeta<typeof PageTitle>;

const Template: ComponentStory<typeof PageTitle> = (args) => <PageTitle {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};

import { ComponentStory, ComponentMeta } from '@storybook/react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { BreadcrumbsCustom } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Shared/BreadcrumbsCustom',
  component: BreadcrumbsCustom,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },

  // https://storybook.js.org/docs/react/writing-stories/args
  args: {
    breadcrumbsList: [
      {
        title: 'Học từ',
        link: '#',
        onClick: () => console.log('clicked'),
      },
      {
        title: 'Giao tiếp cơ bản',
        link: '#',
        onClick: () => console.log('clicked'),
      },
      {
        title: 'Bài 1: Chào hỏi',
        onClick: () => console.log('clicked'),
      }
    ],
    separator: <NavigateNextIcon />
  },
} as ComponentMeta<typeof BreadcrumbsCustom>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BreadcrumbsCustom> = (args) => <BreadcrumbsCustom {...args} />;

export const Default = Template.bind({});
Default.args = {
};
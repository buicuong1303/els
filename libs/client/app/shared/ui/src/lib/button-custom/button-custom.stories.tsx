import { ComponentStory, ComponentMeta } from '@storybook/react';
import CheckIcon from '@mui/icons-material/Check';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { ButtonCustom } from '.';

export default {
  title: 'Shared/ButtonCustom',
  component: ButtonCustom,

  argTypes: {
  },

  args: {
    children: 'Button Custom',
    // endIcon: undefined,
    // startIcon: undefined,
    onClick: () => console.log('Clicked'),
    sx: {},
  },
} as ComponentMeta<typeof ButtonCustom>;

const Template: ComponentStory<typeof ButtonCustom> = (args) => <ButtonCustom {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  size: 'medium',
  variant: 'outlined',
  color: 'primary',
  sx: {
    width: '200px',
  },
  endIcon: <CheckIcon color="success" />,
};

export const Warning = Template.bind({});
Warning.args = {
  size: 'medium',
  variant: 'text',
  color: 'warning',
  endIcon: <ArrowDownwardIcon />,
};

export const Success = Template.bind({});
Success.args = {
  size: 'medium',
  variant: 'text',
  color: 'success',
};

export const Error = Template.bind({});
Error.args = {
  size: 'medium',
  variant: 'outlined',
  color: 'error',
};

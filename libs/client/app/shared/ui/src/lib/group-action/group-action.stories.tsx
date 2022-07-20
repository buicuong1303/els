import { ReactNode } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { GroupAction } from '.';

interface Action {
  label: string;
  icon: ReactNode;
  callback: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
}

const options: Action[] = [
    {
      label: 'Edit',
      icon: <EditIcon fontSize="small" />,
      callback: () => console.log('On edit'),
      color: 'info'
    },
    {
      label: 'Delete',
      icon: <DeleteIcon fontSize="small" />,
      callback: () => console.log('On delete'),
      color: 'error'
    },
];

export default {
  title: 'Shared/GroupAction',
  component: GroupAction,

  args: {
    options: options,
  },
} as ComponentMeta<typeof GroupAction>;

const Template: ComponentStory<typeof GroupAction> = (args) => <GroupAction {...args} />;

export const Default = Template.bind({});
Default.args = {};

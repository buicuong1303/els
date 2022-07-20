import type { ReactNode } from 'react';

import {
  AttendanceIcon,
  ConfigIcon,
  HomeIcon,
  LearningIcon,
  MissionIcon,
  NotificationIcon,
  PersonalIcon,
} from '@els/client/app/shared/ui';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  badgeTooltip?: string;
  active?: boolean;

  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: '',
    items: [
      {
        name: 'Dashboards',
        icon: HomeIcon,
        link: '/home',
      },
      {
        name: 'Personal',
        icon: PersonalIcon,
        link: '/',
      },
      {
        name: 'Missions',
        icon: MissionIcon,
        link: '/missions',
      },
      {
        name: 'Learn words',
        icon: LearningIcon,
        link: '/learning',
      },
      {
        name: 'Notifications',
        icon: NotificationIcon,
        link: '/notifications',
      },
      {
        name: 'Attendance',
        icon: AttendanceIcon,
        link: '/attendance',
      },
      {
        name: '',
        icon: ConfigIcon,
        link: '/settings',
        active: true,
      },
    ]
  }
];

export default menuItems;
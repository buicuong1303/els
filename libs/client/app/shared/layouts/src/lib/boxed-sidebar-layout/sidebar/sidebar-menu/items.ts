import type { ReactNode } from 'react';

// import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
// import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
// import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone';
// import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
// import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
// import KitchenTwoToneIcon from '@mui/icons-material/KitchenTwoTone';
// import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
// import ContactSupportTwoToneIcon from '@mui/icons-material/ContactSupportTwoTone';
// import LocalLibraryTwoToneIcon from '@mui/icons-material/LocalLibraryTwoTone';
// import DnsTwoToneIcon from '@mui/icons-material/DnsTwoTone';
// import TaskAltTwoToneIcon from '@mui/icons-material/TaskAltTwoTone';
// import DocumentScannerTwoToneIcon from '@mui/icons-material/DocumentScannerTwoTone';
// import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
// import QuestionAnswerTwoToneIcon from '@mui/icons-material/QuestionAnswerTwoTone';
// import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone';
// import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
// import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
// import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
// import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
// import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
// import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
// import SupportTwoToneIcon from '@mui/icons-material/SupportTwoTone';
// import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
// import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
// import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';


import {
  ConfigIcon,
  HomeIcon,
  LearningIcon,
  SkillIcon,
  MissionIcon,
} from '@els/client/app/shared/ui';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

// const menuItems: MenuItems[] = [
//   {
//     heading: 'Layout Blueprints',
//     items: [
//       {
//         name: 'Choose layout',
//         icon: BackupTableTwoToneIcon,
//         badge: 'New',
//         link: '',
//         items: [
//           {
//             name: 'Accent header',
//             link: '/dashboards/analytics'
//           },
//           {
//             name: 'Accent sidebar',
//             link: '/dashboards/banking'
//           },
//           {
//             name: 'Boxed sidebar',
//             link: '/dashboards/monitoring'
//           },
//           {
//             name: 'Collapsed sidebar',
//             link: '/dashboards/helpdesk'
//           },
//           {
//             name: 'Bottom navigation',
//             link: '/dashboards/automation'
//           },
//           {
//             name: 'Top navigation',
//             link: '/dashboards/finance'
//           }
//         ]
//       },
//     ]
//   },
//   {
//     heading: 'Dashboards',
//     items: [
//       {
//         name: 'Automation',
//         icon: SmartToyTwoToneIcon,
//         link: '/dashboards/automation',
//         badge: 'Hot'
//       },
//       {
//         name: 'Analytics',
//         icon: AnalyticsTwoToneIcon,
//         link: '/dashboards/analytics'
//       },
//       {
//         name: 'Banking',
//         icon: AccountBalanceTwoToneIcon,
//         link: '/dashboards/banking',
//       },
//       {
//         name: 'Commerce',
//         icon: StoreTwoToneIcon,
//         link: '/dashboards/commerce'
//       },
//       {
//         name: 'Crypto',
//         icon: AccountBalanceWalletTwoToneIcon,
//         link: '/dashboards/crypto'
//       },
//       {
//         name: 'Finance',
//         icon: MonetizationOnTwoToneIcon,
//         link: '/dashboards/finance'
//       },
//       {
//         name: 'Fitness',
//         icon: KitchenTwoToneIcon,
//         link: '/dashboards/fitness'
//       },
//       {
//         name: 'Healthcare',
//         icon: HealthAndSafetyTwoToneIcon,
//         link: '/dashboards/healthcare',
//         items: [
//           {
//             name: 'Doctors Page',
//             badge: 'Hot',
//             link: '/dashboards/healthcare/doctor'
//           },
//           {
//             name: 'Hospital Overview',
//             link: '/dashboards/healthcare/hospital'
//           }
//         ]
//       },
//       {
//         name: 'Helpdesk',
//         icon: ContactSupportTwoToneIcon,
//         link: '/dashboards/helpdesk'
//       },
//       {
//         name: 'Learning',
//         icon: LocalLibraryTwoToneIcon,
//         link: '/dashboards/learning'
//       },
//       {
//         name: 'Monitoring',
//         icon: DnsTwoToneIcon,
//         link: '/dashboards/monitoring'
//       },
//       {
//         name: 'Tasks',
//         icon: TaskAltTwoToneIcon,
//         link: '/dashboards/tasks'
//       }
//     ]
//   },
//   {
//     heading: 'Applications',
//     items: [
//       {
//         name: 'File Manager',
//         icon: DocumentScannerTwoToneIcon,
//         link: '/applications/file-manager'
//       },
//       {
//         name: 'Jobs Platform',
//         icon: WorkTwoToneIcon,
//         link: '/applications/jobs-platform'
//       },
//       {
//         name: 'Messenger',
//         icon: QuestionAnswerTwoToneIcon,
//         link: '/applications/messenger'
//       },
//       {
//         name: 'Projects Board',
//         icon: DashboardCustomizeTwoToneIcon,
//         link: '/applications/projects-board'
//       }
//     ]
//   },
//   {
//     heading: 'Management',
//     items: [
//       {
//         name: 'Users',
//         icon: AssignmentIndTwoToneIcon,
//         link: '/management/users'
//       },
//       {
//         name: 'Projects',
//         icon: AccountTreeTwoToneIcon,
//         link: '/management/projects'
//       },
//       {
//         name: 'Commerce',
//         icon: StorefrontTwoToneIcon,
//         link: '/management/commerce',
//         items: [
//           {
//             name: 'Shop',
//             link: '/management/commerce/shop'
//           },
//           {
//             name: 'Products List',
//             link: '/management/commerce/products'
//           },
//           {
//             name: 'Create Product',
//             link: '/management/commerce/products/create'
//           }
//         ]
//       },
//       {
//         name: 'Invoices',
//         icon: ReceiptTwoToneIcon,
//         link: '/management/invoices'
//       },
//     ]
//   },
//   {
//     heading: 'Extra Pages',
//     items: [
//       {
//         name: 'Auth Pages',
//         icon: VpnKeyTwoToneIcon,
//         link: '/auth',
//         items: [
//           {
//             name: 'Login',
//             items: [
//               {
//                 name: 'Basic',
//                 link: '/account/login-basic'
//               },
//               {
//                 name: 'Cover',
//                 link: '/account/login-cover'
//               }
//             ]
//           },
//           {
//             name: 'Register',
//             items: [
//               {
//                 name: 'Basic',
//                 link: '/account/register-basic'
//               },
//               {
//                 name: 'Cover',
//                 link: '/account/register-cover'
//               },
//               {
//                 name: 'Wizard',
//                 link: '/account/register-wizard'
//               }
//             ]
//           },
//           {
//             name: 'Recover Password',
//             link: '/account/recover-password'
//           }
//         ]
//       },
//       {
//         name: 'Status',
//         icon: ErrorTwoToneIcon,
//         link: '/status',
//         items: [
//           {
//             name: 'Error 404',
//             link: '/status/404'
//           },
//           {
//             name: 'Error 500',
//             link: '/status/500'
//           },
//           {
//             name: 'Maintenance',
//             link: '/status/maintenance'
//           },
//           {
//             name: 'Coming Soon',
//             link: '/status/coming-soon'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     heading: 'Foundation',
//     items: [
//       {
//         name: 'Overview',
//         link: '/',
//         icon: DesignServicesTwoToneIcon
//       },
//       {
//         name: 'Documentation',
//         icon: SupportTwoToneIcon,
//         link: '/docs'
//       }
//     ]
//   }
// ];

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
        name: '',
        icon: ConfigIcon,
        link: '/customizations',
      },
    ]
  }
];

export default menuItems;

/* eslint-disable react-hooks/rules-of-hooks */
import { ListSubheader, Box, alpha, darken, lighten, List } from '@mui/material';
import { useRouter } from 'next/router';
import SidebarMenuItem from './item';
import menuItems, { MenuItem } from './items';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    margin-bottom: ${theme.spacing(.5)};
    padding: 0;

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(2)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(11)};
      color: ${theme.sidebar.menuItemHeadingColor ? lighten(theme.sidebar.menuItemHeadingColor, .3) : theme.sidebar.menuItemHeadingColor};
      padding: ${theme.spacing(1, 3.2)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      padding: 0;
      
      .MuiList-root .MuiList-root .MuiListItem-root .MuiButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 3px ${theme.spacing(2)};
    
        .MuiButton-root {
          display: flex;
          color: ${theme.sidebar.menuItemColor};
          background-color: ${theme.sidebar.menuItemBg};
          width: 100%;
          justify-content: flex-start;
          font-size: ${theme.typography.pxToRem(16)};
          padding: 6.5px 10px;
          position: relative;
          font-weight: 700;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(4)};

            .MuiBadge-standard {
              background: ${theme.colors.primary.main};
              font-size: ${theme.typography.pxToRem(9)};
              font-weight: bold;
              text-transform: uppercase;
              color: ${theme.palette.primary.contrastText};
            }
          }
    
          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            transition: ${theme.transitions.create(['all'])};
            border-radius: ${theme.general.borderRadius};
            background: ${theme.colors.secondary.lighter};
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
            font-size: ${theme.typography.pxToRem(18)};
            margin-right: ${theme.spacing(1.5)};
            margin-left: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${theme.colors.secondary.light};
          }
          
          .MuiButton-endIcon {
            margin-left: auto;
            font-size: ${theme.typography.pxToRem(22)};
          }

          &.Mui-active,
          &:hover {
            color: ${theme.sidebar.menuItemColorActive};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
                color: ${theme.sidebar.menuItemColorActive};
            }
          }

          &.Mui-active {
            background-color: ${theme.colors.secondary.lighter};
            box-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.25);
            color: ${theme.sidebar.menuItemColorActive};
            font-weight: bold;


            .MuiButton-startIcon {
                background: ${theme.colors.primary.main};
                color: ${theme.palette.primary.contrastText};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;
          line-height: 1;

          & > .MuiButton-root {
            .MuiBadge-root {
              right: ${theme.spacing(7)};
            }
          }
      }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px ${theme.spacing(0)};

            .MuiButton-root {
              font-size: ${theme.typography.pxToRem(13)};
              padding: ${theme.spacing(0.5, 2, 0.5, 7.5)};

              &.Mui-active,
              &:hover {
                box-shadow: none;
                background-color: ${theme.sidebar.menuItemBg};
              }
            }
          }
        }
      }
    }
`
);

interface renderSidebarMenuItemsProps {
  items: MenuItem[];
  path: string;
}
const renderSidebarMenuItems = (props: renderSidebarMenuItemsProps): JSX.Element => {
  const { items, path } = props;
  return (
    <SubMenuWrapper>
      <List component="div">
        {items.reduce((ev, item) => reduceChildRoutes({ ev, item, path }), [])}
      </List>
    </SubMenuWrapper>
  );
};

interface reduceChildRoutesProps {
  ev: JSX.Element[];
  item: MenuItem;
  path: string;
}
const reduceChildRoutes = (props: reduceChildRoutesProps): Array<JSX.Element> => {
  const { ev, item, path } = props;

  const key = item.name;
  const router = useRouter();

  const active = item.link === '/'
    ? router.pathname === item.link
    : router.pathname.indexOf(item.link || 'now fount') > -1

  if (item.items) {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={active}
        open={active}
        name={item.name}
        icon={item.icon}
        link={item.link}
        badge={item.badge}
      >
        {renderSidebarMenuItems({
          path,
          items: item.items
        })}
      </SidebarMenuItem>
    );
  } else {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={active}
        name={item.name}
        link={item.link}
        badge={item.badge}
        icon={item.icon}
      />
    );
  }

  return ev;
}

function SidebarMenu() {
  const router = useRouter();
  const { t }: { t: any } = useTranslation();

  return (
    <>
      {menuItems.map((section) => (
        <MenuWrapper key={section.heading}>
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>{t(section.heading)}</ListSubheader>
            }
          >
            {renderSidebarMenuItems({
              items: section.items,
              path: router.pathname
            })}
          </List>
        </MenuWrapper>
      ))}
    </>
  );
}

export default SidebarMenu;

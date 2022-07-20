import { FC, useEffect } from 'react';
import { Box, List, styled } from '@mui/material';
import { useRouter } from 'next/router';
import NavigationMenuItem from './item';
import menuItems, { MenuItem } from './items';
import { v4 as uuidv4 } from 'uuid';
import { GraphqlTypes } from '@els/client/app/shared/data-access';
import { SxProps } from '@mui/system';

const MenuWrapper = styled(Box)(
  () => `
    .MuiList-root {
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      & > .MuiList-root {
        display: flex;
        flex-direction: row;
        width: 100%;
        flex-wrap: wrap;
      }
    }
  `
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    width: 100%;
    .MuiList-root {
      padding: 0;
      display: flex;
      flex-direction: row;
      
      .MuiList-root .MuiList-root .MuiListItem-root .MuiIconButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 0 2px;
        justify-content: center;
        width: auto;

        &:last-child {
          margin-left: auto;
          .MuiButtonBase-root {
            border-radius: 50%;
            padding: 12px;
            .MuiSvgIcon-root {
              margin-right: 0px;
            }
          }
        }
    
        .MuiIconButton-root {
          display: flex;
          background-color: transparent;
          border-radius: ${theme.general.borderRadiusLg};
          justify-content: center;
          font-size: ${theme.typography.pxToRem(14)};
          padding: ${theme.spacing(1.4, 2)};
          position: relative;
          font-weight: bold;
          color: ${theme.colors.alpha.trueWhite[100]};

          .name-wrapper {
            transition: ${theme.transitions.create(['color'])};
          }

          .MuiBadge-root {
            position: absolute;
            right: 16px;
            top: 12px;

            .MuiBadge-badge {
              background: ${theme.colors.alpha.white[70]};
              color: ${theme.colors.alpha.black[100]};
              font-size: ${theme.typography.pxToRem(11)};
              font-weight: bold;
              text-transform: uppercase;
            }
          }
  
          .MuiSvgIcon-root {
            transition: ${theme.transitions.create(['color'])};
            font-size: ${theme.typography.pxToRem(24)};
            margin-right: ${theme.spacing(1)};
            color: ${theme.colors.alpha.trueWhite[100]};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.colors.alpha.white[10]};

            .MuiSvgIcon-root {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }
      }
    }
  `
);

const renderNavigationMenuItems = ({
  items,
  path,
  currentUser,
}: {
  items: MenuItem[];
  path: string;
  currentUser?: GraphqlTypes.LearningTypes.User;
}): JSX.Element => (
  <SubMenuWrapper>
    <List component="div">
      {items.reduce((ev: JSX.Element[], item) => {
        if (currentUser?.extraInfo?.numberOfCompletedMissions > 0 && item.link === '/missions') {
          item.badge = '';
        } else {
          delete item.badge;
        }

        return reduceChildRoutes({ ev, item, path });
      }, [])}
    </List>
  </SubMenuWrapper>
);

const reduceChildRoutes = ({
  ev,
  path,
  item
}: {
  ev: JSX.Element[];
  path: string;
  item: MenuItem;
}): Array<JSX.Element> => {
  const key = uuidv4();
  const partialMatch = item.link === '/' ? path === item.link : path.includes(item.link ?? '');
  const active = item.active;

  if (item.items) {
    ev.push(
      <NavigationMenuItem
        key={key}
        active={active || partialMatch}
        open={partialMatch}
        name={item.name}
        icon={item.icon}
        link={item.link}
        badge={item.badge}
      >
        {renderNavigationMenuItems({
          path,
          items: item.items
        })}
      </NavigationMenuItem>
    );
  } else {
    ev.push(
      <NavigationMenuItem
        key={key}
        active={active || partialMatch}
        name={item.name}
        link={item.link}
        badge={item.badge}
        icon={item.icon}
      />
    );
  }

  return ev;
};

interface NavigationMenuProps {
  currentUser?: GraphqlTypes.LearningTypes.User;
  sx?: SxProps;
}

const NavigationMenu: FC<NavigationMenuProps> = (props) => {
  const { currentUser, sx } = props;

  const router = useRouter();

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }
  };

  useEffect(handlePathChange, [router.isReady, router.asPath]);

  return (
    <Box sx={sx}>
      {menuItems.map((section) => {
        return (
          <MenuWrapper key={uuidv4()}>
            <List component="div">
              {renderNavigationMenuItems({
                items: section.items,
                path: router.asPath,
                currentUser: currentUser,
              })}
            </List>
          </MenuWrapper>
        );
      })}
    </Box>
  );
};

export default NavigationMenu;
